'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useState } from 'react'
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Minus,
  ImagePlus,
} from 'lucide-react'

interface TipTapEditorProps {
  content: Record<string, unknown>
  onChange: (json: Record<string, unknown>, wordCount: number) => void
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
    onCreate: ({ editor }) => {
      setWordCount(countWords(editor.getText()))
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const text = editor.getText()
      const count = countWords(text)
      setWordCount(count)
      onChange(json as Record<string, unknown>, count)
    },
  })

  function btnClass(active: boolean): string {
    return `p-2 rounded hover:bg-zinc-100 text-zinc-600${
      active ? ' bg-[#C9A84C]/15 text-[#C9A84C]' : ''
    }`
  }

  if (!editor) return null

  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div>
      <div className="border border-zinc-300 rounded-t border-b-0 flex flex-wrap gap-1 p-2 bg-zinc-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
          aria-label="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
          aria-label="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="Bold"
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="Italic"
          aria-label="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
          title="Blockquote"
          aria-label="Blockquote"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="Bullet list"
          aria-label="Bullet list"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="Numbered list"
          aria-label="Numbered list"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass(false)}
          title="Horizontal rule"
          aria-label="Horizontal rule"
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Image URL')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          className={btnClass(false)}
          title="Insert image"
          aria-label="Insert image"
        >
          <ImagePlus size={18} />
        </button>
      </div>

      <div className="border border-zinc-300 rounded-b">
        <EditorContent editor={editor} />
      </div>

      <p className="text-xs text-zinc-400 mt-1">
        {wordCount} words · {readTime} min read
      </p>
    </div>
  )
}
