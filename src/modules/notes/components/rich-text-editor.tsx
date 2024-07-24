'use client'

import { useCallback, useState } from 'react'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Code, Italic, List, ListOrdered, ListTodo, Strikethrough, TextQuote } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/modules/design-system/components/button'
import { Toggle } from '@/modules/design-system/components/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

type RichTextEditorProps = {
  onChange?: (content: string) => void
  value: string
  isPending?: boolean
  isEditing?: boolean
  hasChanges?: boolean
  isViewOnly?: boolean
  handleOnSubmit?: () => void
}

const RichTextEditor = ({
  onChange,
  value,
  isPending,
  isEditing,
  hasChanges,
  isViewOnly,
  handleOnSubmit,
}: RichTextEditorProps) => {
  const [showCharCount, setShowCharCount] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: isViewOnly ? false : true,
    editable: !isViewOnly,
    editorProps: {
      attributes: {
        class: `focus:outline-none ${!isViewOnly && 'min-h-[7.375rem]'}`,
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4 ml-3',
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
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex gap-2 [&>div>p]:min-w-px',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'pl-0 list-none',
        },
      }),
      Extension.create({
        name: 'submit',
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => {
              if (!this.editor.isEmpty) {
                handleOnSubmit?.()
                return true
              }
              return false
            },
          }
        },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
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

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const toggleTaskList = useCallback(() => {
    editor?.chain().focus().toggleTaskList().run()
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

  const showSubmitButton = (isEditing && hasChanges) || (!isEditing && hasContent())

  return (
    <div className="">
      <EditorContent
        editor={editor}
        className={cn(
          isViewOnly
            ? 'pointer-events-none'
            : 'textarea-scrollbar max-h-[calc(75svh-4rem)] overflow-y-auto bg-base px-6 pt-3 font-mono leading-relaxed focus:outline-none'
        )}
      />

      {!isViewOnly && (
        <div className="relative mt-8 grid w-full grid-cols-[1fr_auto_1fr] place-items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={toggleCount}
                  className="h-max justify-self-start px-2"
                  aria-label={`Toggle between word and character count. Currently showing ${label}.`}
                >
                  <span className="font-mono text-3xs font-normal text-tertiary">
                    {count || 0} {label}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Switch to {label === 'characters' ? 'words' : 'characters'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex flex-wrap gap-1 justify-self-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={toggleBold}>
                      <Bold className="size-3.5" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Bold
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      B
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={toggleItalic}>
                      <Italic className="size-3.5" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Italic
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-mono font-medium">
                      I
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={toggleStrike}>
                      <Strikethrough className="size-3.5" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Strikethrough
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      Shift
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      S
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={toggleOrderedList}>
                      <ListOrdered className="size-4" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Ordered List
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      Shift
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      7
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={toggleBulletList}>
                      <List className="size-4" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Bullet List
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      Shift
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      8
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('taskList')} onPressedChange={toggleTaskList}>
                      <ListTodo className="size-4" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Task List
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      Shift
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      9
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={blockQuote}>
                      <TextQuote className="size-4" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Block Quote
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      Shift
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      B
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Toggle size="sm" pressed={editor.isActive('codeBlock')} onPressedChange={toggleCodeBlock}>
                      <Code className="size-4" />
                    </Toggle>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex items-center gap-1">
                    Code Block
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      Alt
                    </kbd>
                    <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                      C
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {(showSubmitButton || isPending) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="shiny"
                    type="submit"
                    onClick={handleOnSubmit}
                    disabled={isPending || editor.isEmpty || (isEditing && !hasChanges)}
                    className="justify-self-end"
                  >
                    {isPending ? (isEditing ? 'Updating...' : 'Saving...') : isEditing ? 'Update' : 'Save'}
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
                    to {isEditing ? 'update' : 'save'} note
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  )
}

export { RichTextEditor }
