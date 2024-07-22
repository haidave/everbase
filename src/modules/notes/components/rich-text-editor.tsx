'use client'

import { useCallback, useState } from 'react'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Code, Italic, List, ListOrdered, Strikethrough, TextQuote } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/modules/design-system/components/button'
import { Toggle } from '@/modules/design-system/components/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

type RichTextEditorProps = {
  onChange: (content: string) => void
  value: string
  isSaving: boolean
  handleOnSubmit: () => void
}

const RichTextEditor = ({ onChange, value, isSaving, handleOnSubmit }: RichTextEditorProps) => {
  const [showCharCount, setShowCharCount] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[7.375rem]',
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 text-primary',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-subtle p-4 text-sm rounded-md font-mono',
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Type something...',
      }),
      CharacterCount,
      Extension.create({
        name: 'submit',
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => {
              handleOnSubmit()
              return true
            },
          }
        },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run()
  }, [editor])

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run()
  }, [editor])

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run()
  }, [editor])

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  const blockQuote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run()
  }, [editor])

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run()
  }, [editor])

  if (!editor) {
    return null
  }

  const toggleCount = () => setShowCharCount((prev) => !prev)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const count = showCharCount ? editor.storage.characterCount.characters() : editor.storage.characterCount.words()
  const label = showCharCount ? 'characters' : 'words'

  const hasContent = () => {
    return editor && !editor.isEmpty
  }

  return (
    <div className="">
      <EditorContent
        editor={editor}
        className="textarea-scrollbar max-h-[calc(75svh-4rem)] overflow-y-auto bg-base px-6 pt-3 font-mono leading-relaxed focus:outline-none"
      />

      <div className="relative mt-8 flex justify-between">
        <Button
          variant="ghost"
          type="button"
          onClick={toggleCount}
          className="mt-auto h-max px-1"
          aria-label={`Toggle between word and character count. Currently showing ${label}.`}
        >
          <span className="font-mono text-3xs font-normal text-tertiary">
            {count || 0} {label}
          </span>
        </Button>

        <div className="absolute left-1/2 flex -translate-x-1/2 flex-wrap gap-1">
          <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={toggleBold}>
            <Bold className="size-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={toggleItalic}>
            <Italic className="size-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={toggleStrike}>
            <Strikethrough className="size-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={toggleBulletList}>
            <List className="size-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={toggleOrderedList}>
            <ListOrdered className="size-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={blockQuote}>
            <TextQuote className="size-4" />
          </Toggle>
          <Toggle size="sm" pressed={editor.isActive('codeBlock')} onPressedChange={toggleCodeBlock}>
            <Code className="size-4" />
          </Toggle>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="shiny"
                type="submit"
                onClick={handleOnSubmit}
                disabled={isSaving}
                className={cn(hasContent() || isSaving ? 'opacity-100' : 'pointer-events-none opacity-0', 'ml-auto')}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                    ⌘
                  </kbd>
                  <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                    Enter
                  </kbd>
                </div>
                to save note
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export { RichTextEditor }
