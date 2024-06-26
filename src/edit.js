import { useEffect, useState } from 'react';
import { WordpressBlockEditor, WordpressComponents } from '@wordpress/blocks';

const {useBlockProps, BlockIcon} = WordpressBlockEditor;
const {Placeholder, ComboboxControl, BaseControl, Button, Panel} = WordpressComponents;

import './editor.scss';

import metadata from './block.json';

/**
 * @property {settings: object} [wp] - WordPress editor instance
 * @property {string[]} [themeValues] - list of theme values (dark, light)
 */

export default function Edit(props) {
	const {
		attributes: {data, meta},
		setAttributes
	} = props;

	const {id} = data ?? {id: null};
	const {avatar} = meta ?? {};

	const [articles, setArticles] = useState([]);

	const {blockSettings: {[metadata.name]: options}} = window.wp.settings;

	const icon = <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
					  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
		<path fillRule="evenodd"
			  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z"
			  clipRule="evenodd"/>
	</svg>;

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		try {
			const url = new URL(options.apiUrl);
			if(options.extraQueryParams){
				Object.keys(options.extraQueryParams).forEach(key => url.searchParams.append(key, options.extraQueryParams[key]));
			}

			const response = await fetch(url.toString(), {
				headers: { 'Authorization': 'Bearer ' + window.token }
			});
			const res = await response.json();
			processResponse(res.data);
		} catch (error) {
			setArticles([]);
		}
	}

	const processResponse = (data) => {
		let list = [
			{
				value: null,
				label: 'No selection'
			}
		];

		for (const article of data) {
			list.push(article.meta?.presenter?.dropdown ?? {});
		}

		setArticles(list);
	}

	const onFilterValueChange = async (search) => {
		try {
			const url = new URL(options.apiUrl);
			url.searchParams.append('filter[q]', search);
			if(options.extraQueryParams){
				Object.keys(options.extraQueryParams).forEach(key => url.searchParams.append(key, options.extraQueryParams[key]));
			}

			const response = await fetch(url.toString(), {
				headers: { 'Authorization': 'Bearer ' + window.token }
			});
			const res = await response.json();
			processResponse(res.data);
		} catch (error) {
			setArticles([]);
		}
	}

	const reload = async () => {
		if (id?.length > 0) {
			try {
				const url = new URL(options.apiUrl + '/' + id);
				if(options.extraQueryParams){
					Object.keys(options.extraQueryParams).forEach(key => url.searchParams.append(key, options.extraQueryParams[key]));
				}

				const response = await fetch(url.toString(), {
					headers: { 'Authorization': 'Bearer ' + window.token }
				});
				const res = await response.json();
				if (res.id) {
					setAttributes({
						data: {id: res.id},
						meta: res.meta?.presenter?.dropdown
					});
				}
			} catch (error) {
				// Handle error
			}
		}
	}

	return (
		<BaseControl {...useBlockProps()}>
			<Placeholder
				icon={<BlockIcon icon={icon}/>}
				instructions={'Introduceti cel putin 3 caractere pentru a cauta in rezultate'}
				label={"Articol"}>
				<div style={{width: 'inherit'}}>

					<div style={{display: 'flex'}}>
						<div>
							<img src={avatar} alt={''} width={38} height={38} style={{minWidth: 38, height: 38}}/>
						</div>

						<div style={{padding: '0 5px'}}>
							<ComboboxControl
								value={id}
								__next40pxDefaultSize={true}
								hideLabelFromVision={true}
								onChange={(value) => {
									const articleData = articles.filter( ( article ) => article.value === value)[0];
									setAttributes({data: {id: value}, meta: articleData});
								}}
								options={articles}
								onFilterValueChange={(inputValue) => onFilterValueChange(inputValue)}
								__experimentalRenderItem={({item}) => {
									return (
										<div style={{display: 'inline-flex', alignItems: 'center'}}>
											{
												item?.avatar?.length > 0 &&
												<img src={item.avatar}
													 alt="" width="25" height="25" style={{marginRight: 10}}/>
											}
											<span>{item.label}</span>
										</div>
									);
								}}
							/>
						</div>

						{
							id?.length > 0 &&
							<Button onClick={reload} isPrimary variant={'primary'} style={{height: 38}}>
								Reload
							</Button>
						}
					</div>

				</div>
			</Placeholder>
		</BaseControl>
	);
}

