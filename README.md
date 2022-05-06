# usePageLifecycle

_The hook returns the current state of the page's lifecycle and whether the page has been removed from a hidden tab._

According to the [Page Lifecycle API](https://developer.chrome.com/blog/page-lifecycle-api/), a page can have one of the following states at any given time:
- Active
- Passive
- Hidden
- Frozen
- Terminated
- Discarded

## Install

To install package run:
```bash
npm install --save use-page-lifecycle
```

## Usage

```jsx
import { useEffect } from 'react'
import { LifecycleState, usePageLifecycle } from 'use-page-lifecycle'

export default () => {
  const [lifecycleState] = usePageLifecycle()

  useEffect(() => {
      if (lifecycleState === LifecycleState.FROZEN) {
        // some action
      }
  }, [lifecycleState])
    
  return (
    <div>
      <h1>use-page-lifecycle</h1>
    </div>
  )
}
```

## License

MIT
