// src/plugins/cursor.ts
import { type App, type Plugin, ref } from 'vue'
import { CursorCore,  type CursorOptions, type CursorType } from '@/utils/cursorCore'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $cursor: {
            setType: (type: CursorType) => void
            show: () => void
            hide: () => void
            isMobile: boolean
        }
    }
}

export const useCursor = () => {
    const isMobile = ref(false)

    const checkMobile = () => {
        isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.matchMedia('(pointer: coarse)').matches
    }

    return { isMobile, checkMobile }
}

export const cursorPlugin: Plugin = {
    install(app: App, options?: CursorOptions) {
        const { isMobile, checkMobile } = useCursor()
        checkMobile()

        let cursorInstance: CursorCore | null = null

        app.config.globalProperties.$cursor = {
            setType: (type: CursorType) => cursorInstance?.setType(type),
            show: () => cursorInstance?.show(),
            hide: () => cursorInstance?.hide(),
            isMobile
        }

        app.mixin({
            mounted() {
                if (isMobile.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return
                }

                if (!cursorInstance) {
                    const cursorEl = document.createElement('div')
                    cursorEl.className = 'vue-cursor'
                    document.body.appendChild(cursorEl)
                    cursorInstance = new CursorCore(cursorEl, options)
                    document.body.style.cursor = 'none'
                }
            },
            beforeUnmount() {
                if (this === app._instance && cursorInstance) {
                    cursorInstance.destroy()
                    cursorInstance = null
                    document.body.style.cursor = ''
                }
            }
        })
    }
}