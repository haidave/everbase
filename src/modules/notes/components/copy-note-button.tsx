import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/design-system/components/tooltip'

type CopyNoteButtonProps = {
  content: string
}

const CopyNoteButton = ({ content }: CopyNoteButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const editorConfig = useMemo(
    () => ({
      immediatelyRender: false,
      extensions: [StarterKit, TaskItem, TaskList],
      content,
      editable: false,
    }),
    [content]
  )

  const editor = useEditor(editorConfig)

  const handleCopyToClipboard = useCallback(async () => {
    if (!editor) return

    try {
      const html = editor.getHTML()
      const plain = editor.getText()

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ])

      setIsCopied(true)
      setShowTooltip(true)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }, [editor])

  useEffect(() => {
    if (isCopied) {
      const timeoutId = window.setTimeout(() => {
        setIsCopied(false)
      }, 2000)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }
  }, [isCopied])

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'c' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !isCopied &&
        !document.querySelector('[data-edit-dialog]')
      ) {
        event.preventDefault()
        event.stopPropagation()
        void handleCopyToClipboard()
        buttonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isCopied, handleCopyToClipboard])

  return (
    <>
      <div className="hidden">
        <EditorContent editor={editor} />
      </div>
      <TooltipProvider delayDuration={300}>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyToClipboard}
              ref={buttonRef}
              aria-label={isCopied ? 'Copied to clipboard' : 'Copy note'}
            >
              {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isCopied ? (
              <p>Copied!</p>
            ) : (
              <p className="flex items-center gap-1.5">
                Copy note{' '}
                <kbd className="pointer-events-none flex h-[1.125rem] select-none items-center rounded border border-line bg-primary-hover px-1 font-sans font-medium">
                  C
                </kbd>
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export { CopyNoteButton }
