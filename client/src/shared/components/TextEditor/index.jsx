import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { ImageUpload } from 'quill-image-upload';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
import { getStoredAuthToken } from 'shared/utils/authToken';
import toast from 'shared/utils/toast';

import { EditorCont } from './Styles';

const propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  getEditor: PropTypes.func,
};

const defaultProps = {
  className: undefined,
  placeholder: undefined,
  defaultValue: undefined,
  value: undefined,
  onChange: () => {},
  onSave: () => {},
  getEditor: () => {},
};

Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
Quill.register('modules/imageUpload', ImageUpload);

const TextEditor = ({
  className,
  placeholder,
  defaultValue,
  // we're not really feeding new value to quill instance on each render because it's too
  // expensive, but we're still accepting 'value' prop as alias for defaultValue because
  // other components like <Form.Field> feed their children with data via the 'value' prop
  value: alsoDefaultValue,
  onChange,
  getEditor,
  onSave,
}) => {
  const $editorContRef = useRef();
  const $editorRef = useRef();
  const initialValueRef = useRef(defaultValue || alsoDefaultValue || '');

  useLayoutEffect(() => {
    let quill = new Quill($editorRef.current, {
      placeholder,
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          ['clean'],
        ],
        /* jsyang: SAVE via hotkey in any Quill edit area */
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              shortKey: true,
              handler: onSave,
            },
          },
        },
        /* Upload images for storage instead of inlining them via base64 (Quill default) */
        imageUpload: {
          url: `${process.env.API_URL}/image/upload`,
          name: 'image',
          withCredentials: false,
          headers: {
            Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
          },
          callbackKO: serverError => {
            toast.error(serverError);
          },
        },
        markdownShortcuts: {},
      },
    });

    const insertInitialValue = () => {
      quill.clipboard.dangerouslyPasteHTML(0, initialValueRef.current);
      quill.blur();
    };
    const handleContentsChange = () => {
      onChange(getHTMLValue());
    };
    const getHTMLValue = () => $editorContRef.current.querySelector('.ql-editor').innerHTML;

    insertInitialValue();
    getEditor({ getValue: getHTMLValue });

    quill.on('text-change', handleContentsChange);
    return () => {
      quill.off('text-change', handleContentsChange);
      quill = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditorCont className={className} ref={$editorContRef}>
      <div ref={$editorRef} />
    </EditorCont>
  );
};

TextEditor.propTypes = propTypes;
TextEditor.defaultProps = defaultProps;

export default TextEditor;
