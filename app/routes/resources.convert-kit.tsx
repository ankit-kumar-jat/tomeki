import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { Link, useFetcher } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { DynamicBlurBackground } from '~/components/dynamic-blur-background'
import { cn } from '~/lib/utils'

type ConvertKitSubscriber = {
  id: number
  first_name: string
  email_address: string
  state: 'active' | 'inactive'
  created_at: string
  fields: Record<string, string | null>
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get('email')
  const honeypot = formData.get('mypot')

  if (honeypot) return { error: true, message: '', subscription: null }

  if (typeof email !== 'string' || !email) {
    return {
      error: true,
      message: 'Email address is required',
      subscription: null,
    }
  }

  const API_KEY = context.cloudflare.env.CONVERT_KIT_API_KEY
  const FORM_ID = context.cloudflare.env.CONVERT_KIT_FORM_ID
  const API_URL = 'https://api.kit.com/v3'

  const res = await fetch(`${API_URL}/forms/${FORM_ID}/subscribe`, {
    method: 'post',
    body: JSON.stringify({ api_key: API_KEY, email }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })

  const jsonRes = (await res.json()) as {
    message?: string
    subscription?: ConvertKitSubscriber
  }

  if (!res.ok)
    return { error: true, message: jsonRes?.message, subscription: null }

  return {
    error: false,
    subscription: jsonRes?.subscription,
    message: '',
  }
}

type FormState = 'idle' | 'success' | 'error' | 'submitting'

export function NewsletterSubscriptionForm() {
  const fetcher = useFetcher<typeof action>()

  const state: FormState =
    fetcher.state === 'submitting'
      ? 'submitting'
      : fetcher.data?.subscription
        ? 'success'
        : fetcher.data?.error
          ? 'error'
          : 'idle'

  const inputRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef<boolean>(false)

  useEffect(() => {
    if (state === 'error') {
      inputRef.current?.focus()
    }
    if (state === 'idle' && mounted.current) {
      inputRef.current?.select()
    }
    if (state === 'success') {
      successRef.current?.focus()
    }

    mounted.current = true
  }, [state])

  return (
    <div className="relative mx-auto my-16 grid max-w-lg grid-cols-[1/1] place-items-center text-center md:my-20">
      <fetcher.Form
        action="/resources/convert-kit"
        method="post"
        className={cn(
          'pointer-events-none scale-75 opacity-0 transition-[transform,opacity] delay-0 duration-300 [grid-area:1/1]',
          state !== 'success' &&
            'pointer-events-auto scale-100 opacity-100 delay-300',
        )}
        aria-hidden={state !== 'success'}
      >
        <h2 className="text-balance text-2xl drop-shadow-md sm:text-3xl lg:text-4xl">
          Unlock a World of Books!
        </h2>
        <p className="mt-2 drop-shadow-sm">
          Join our newsletter to receive the latest book discoveries, reading
          tips, and exclusive updates straight to your inbox.
        </p>
        <div className="mt-8 flex rounded-full border border-foreground/30">
          <input
            ref={inputRef}
            name="email"
            type="email"
            required
            className="h-12 w-full rounded-s-full bg-transparent pl-6 outline-none ring-primary placeholder:text-foreground/70 placeholder:drop-shadow-sm focus-within:ring-2"
            placeholder="Enter your email"
          />
          <input type="text" name="mypot" hidden defaultValue="" />
          <button
            disabled={state === 'submitting'}
            className="min-w-32 rounded-e-full border-l border-l-foreground/30 p-3 pr-4 outline-none ring-primary focus-within:ring-2"
          >
            {state === 'submitting' ? 'Subscribing...' : 'Subscibe'}
          </button>
        </div>
        <p className="mt-2 text-sm text-destructive drop-shadow-sm">
          {fetcher.data?.error ? fetcher.data?.message : <>&nbsp;</>}
        </p>
      </fetcher.Form>
      <div
        aria-hidden={state === 'success'}
        className={cn(
          'pointer-events-none scale-75 opacity-0 transition-[transform,opacity] delay-0 duration-300 [grid-area:1/1]',
          state === 'success' &&
            'pointer-events-auto scale-100 opacity-100 delay-300',
        )}
      >
        <h2
          ref={successRef}
          className="text-2xl drop-shadow-md sm:text-3xl lg:text-4xl"
        >
          You're subscribed!
        </h2>
        <p className="mt-2 drop-shadow-sm">
          Please check your email to confirm your subscription.
        </p>
        <Link
          to="."
          className="mt-2 inline-block font-medium underline"
          preventScrollReset
          reloadDocument
        >
          Start over
        </Link>
      </div>
      <DynamicBlurBackground />
    </div>
  )
}
