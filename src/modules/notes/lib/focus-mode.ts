import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

interface FocusModeOptions {
  isActive: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    focusMode: {
      setFocusMode: (isActive: boolean) => ReturnType
    }
  }

  interface EditorEvents {
    focusModeChange: boolean
  }
}

const FocusModeExtension = Extension.create<FocusModeOptions>({
  name: 'focusMode',

  addOptions() {
    return {
      isActive: false,
    }
  },

  addCommands() {
    return {
      setFocusMode:
        (isActive: boolean) =>
        ({ commands }) => {
          this.options.isActive = isActive
          this.editor.emit('focusModeChange', isActive)
          return commands.setMeta('focusMode', isActive)
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-f': () => {
        return this.editor.commands.setFocusMode(!this.options.isActive)
      },
    }
  },

  addProseMirrorPlugins() {
    let activeSentenceStart = 0
    let activeSentenceEnd = 0

    return [
      new Plugin({
        key: new PluginKey('focus-mode'),
        props: {
          decorations: (state) => {
            if (!this.options.isActive) {
              return DecorationSet.empty
            }

            const { doc, selection } = state
            const decorations: Decoration[] = []

            const currentPos = selection.$head.pos

            // Function to check if a position is only whitespace
            const isWhitespace = (pos: number) => /^\s*$/.test(doc.textBetween(pos, pos + 1))

            // Function to check if a character is sentence-ending punctuation
            const isSentenceEnding = (pos: number) => /[.!?]/.test(doc.textBetween(pos, pos + 1))

            // Check if we need to update the active sentence
            if (
              doc.content.size === 0 ||
              currentPos < activeSentenceStart ||
              (currentPos > activeSentenceEnd && !isWhitespace(currentPos - 1) && !isSentenceEnding(currentPos - 1))
            ) {
              // Find the start of the new sentence
              let start = currentPos
              while (
                start > 0 &&
                !isSentenceEnding(start - 1) &&
                !(isWhitespace(start - 1) && isSentenceEnding(start - 2))
              ) {
                start--
              }

              // Find the end of the new sentence
              let end = currentPos
              while (end < doc.content.size && !isSentenceEnding(end)) {
                end++
              }
              end++ // Include the punctuation mark

              // Update active sentence boundaries
              activeSentenceStart = start
              activeSentenceEnd = end
            }

            // If the document is not empty, add decorations
            if (doc.content.size > 0) {
              // Extend activeSentenceEnd to include trailing whitespace and ensure punctuation is included
              let extendedEnd = activeSentenceEnd
              while (
                extendedEnd < doc.content.size &&
                (isWhitespace(extendedEnd) || isSentenceEnding(extendedEnd - 1))
              ) {
                extendedEnd++
              }

              // Add decoration to the active sentence
              decorations.push(Decoration.inline(activeSentenceStart, extendedEnd, { class: 'text-primary' }))

              // Add decoration to the text before the active sentence
              if (activeSentenceStart > 0) {
                decorations.push(Decoration.inline(0, activeSentenceStart, { class: 'text-tertiary' }))
              }

              // Add decoration to the text after the active sentence
              if (extendedEnd < doc.content.size) {
                decorations.push(Decoration.inline(extendedEnd, doc.content.size, { class: 'text-tertiary' }))
              }
            }

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

export { FocusModeExtension }
