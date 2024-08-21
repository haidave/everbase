import { useCallback, useEffect, useMemo, useState } from 'react'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button } from '@/modules/design-system/components/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/modules/design-system/components/tooltip'

type CopyNoteButtonProps = {
  content: string
}

const CopyNoteButton = ({ content }: CopyNoteButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

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

  useHotkeys(
    'c',
    () => {
      void handleCopyToClipboard()
    },
    {
      enabled: () => !isCopied && !document.querySelector('[data-edit-dialog]'),
      preventDefault: true,
    },
    [isCopied, handleCopyToClipboard]
  )

  const variants = {
    hidden: { opacity: 0, scale: 0.5, transition: { duration: 0.15 } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
  }

  return (
    <>
      <div className="hidden">
        <EditorContent editor={editor} />
      </div>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyToClipboard}
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy note'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.span key="checkmark" variants={variants} initial="hidden" animate="visible" exit="hidden">
                  <CheckIcon className="size-4" />
                </motion.span>
              ) : (
                <motion.span key="copy" variants={variants} initial="hidden" animate="visible" exit="hidden">
                  <CopyIcon className="size-4" />
                </motion.span>
              )}
            </AnimatePresence>
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
    </>
  )
}

export { CopyNoteButton }
