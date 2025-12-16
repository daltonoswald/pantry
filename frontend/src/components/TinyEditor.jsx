import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyEditor({ value, onChange }) {
  const editorRef = useRef(null)
  return (
    <Editor
      apiKey='6h74qyuu9367xfkt9kh0m9qqsmxmxe1qwc1da7f9av2kra9u'
      onInit={(evt, editor) => (editorRef.current = editor)}
      // initialValue='<p>Directions</p>'
      value={value}
      init={{
        height: 400,
        menubar: false,
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
        ],
        selector: 'textarea',
        toolbar: [
          { label: 'Directions', items: ['undo', 'redo'] },
          { name: 'blocks', items: ['blocks'] },
          { name: 'styles', items: ['bold', 'italic'] },
          { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright'] },
          { name: 'list', items: ['bullist', 'numlist'] },
          { name: 'link', items: ['link']}
        ],
        // toolbar2: "undo redo | blocks | bold italic | alignleft aligncenter alignreight | bullist numlist | link image | code"
      }}
      onEditorChange={(content => onChange(content))}
    />
  );
}