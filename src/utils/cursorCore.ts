// src/libs/CursorCore.ts
import { ref, watchEffect, onScopeDispose } from 'vue'

export type CursorType = 'default' | 'pointer' | 'text' | 'custom' | 'hidden'
type CursorState = 'idle' | 'hover' | 'active'

export interface CursorOptions {
    baseSize?: number
    scale?: {
        hover?: number
        active?: number
    }
    styles?: Partial<CSSStyleDeclaration>
    reactivity?: boolean
}

export class CursorCore {
    private el: HTMLElement
    private pos = { x: 0, y: 0 }
    private lastPos = { x: 0, y: 0 }
    private velocity = { x: 0, y: 0 }
    private rafId: number | null = null
    private state: CursorState = 'idle'
    private type: CursorType = 'default'
    private isVisible = true
    private options: Required<CursorOptions>

    private static defaultOptions: Required<CursorOptions> = {
        baseSize: 24,
        scale: {
            hover: 1.5,
            active: 0.7
        },
        styles: {
            mixBlendMode: 'difference',
            pointerEvents: 'none',
            zIndex: '9999'
        },
        reactivity: true
    }

    constructor(element: HTMLElement, options?: CursorOptions) {
        this.options = { ...CursorCore.defaultOptions, ...options }
        this.el = element
        this.initElement()
        this.setupEventListeners()
        this.startAnimationLoop()
    }

    private initElement() {
        Object.assign(this.el.style, {
            position: 'fixed',
            width: `${this.options.baseSize}px`,
            height: `${this.options.baseSize}px`,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
            contain: 'strict',
            transition: 'transform 0.1s ease, opacity 0.2s ease',
            ...this.options.styles
        })

        this.el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      </svg>
    `
    }

    private setupEventListeners() {
        const handleMove = (e: MouseEvent) => {
            this.lastPos = { ...this.pos }
            this.pos = { x: e.clientX, y: e.clientY }
            this.velocity = {
                x: this.pos.x - this.lastPos.x,
                y: this.pos.y - this.lastPos.y
            }
        }

        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mousedown', () => this.setState('active'))
        window.addEventListener('mouseup', () => this.setState('hover'))
        window.addEventListener('blur', () => this.hide())
        window.addEventListener('focus', () => this.show())

        onScopeDispose(() => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mousedown', () => this.setState('active'))
            window.removeEventListener('mouseup', () => this.setState('hover'))
            window.removeEventListener('blur', () => this.hide())
            window.removeEventListener('focus', () => this.show())
            this.stopAnimationLoop()
        })
    }

    private startAnimationLoop() {
        const update = () => {
            const predictX = this.pos.x + this.velocity.x * 0.3
            const predictY = this.pos.y + this.velocity.y * 0.3

            this.el.style.transform = `translate(-50%, -50%) translate(${predictX}px, ${predictY}px)`
            this.rafId = requestAnimationFrame(update)
        }
        this.rafId = requestAnimationFrame(update)
    }

    private stopAnimationLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId)
            this.rafId = null
        }
    }

    private setState(state: CursorState) {
        this.state = state
        this.updateStyle()
    }

    private updateStyle() {
        let scale = 1
        switch (this.state) {
            case 'hover': scale = this.options.scale.hover || 1; break
            case 'active': scale = this.options.scale.active || 1; break
        }

        this.el.style.transform = `translate(-50%, -50%) translate(${this.pos.x}px, ${this.pos.y}px) scale(${scale})`
        this.el.style.opacity = this.isVisible ? '1' : '0'
    }

    public setType(type: CursorType) {
        this.type = type
        // 可以根据类型更新样式
    }

    public show() {
        this.isVisible = true
        this.updateStyle()
    }

    public hide() {
        this.isVisible = false
        this.updateStyle()
    }

    public destroy() {
        this.stopAnimationLoop()
        this.el.remove()
    }
}