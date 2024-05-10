/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
// import { useBlockProps } from '@wordpress/block-editor';
// import { TextControl } from '@wordpress/components';
import { WordpressBlockEditor, WordpressComponents } from '@wordpress/blocks';
import metadata from './block.json';

const {useBlockProps} = WordpressBlockEditor;
// const {TextControl} = WordpressComponents;

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save(props) {
	const {attributes: {data, meta}} = props;
	const {id} = data ?? {};
	const {avatar, label} = meta ?? {};

	return (
		<div { ...useBlockProps.save() }>
			<div style={{display: 'flex'}} id={'articleId-' + id}>
				<div>
					<img src={avatar} alt={''} width={40} height={40}/>
				</div>
				<span>{label}</span>
			</div>
		</div>
	);
}
