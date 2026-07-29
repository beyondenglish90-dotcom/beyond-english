import { Link } from 'react-router-dom'

/**
 * variant: 'primary' | 'outline' | 'ghost'
 * as: 'button' | 'link' (react-router Link, `to` 필요) | 'a' (외부 링크, `href` 필요)
 */
export default function Button({
  as = 'button',
  variant = 'primary',
  size,
  to,
  href,
  className = '',
  children,
  ...rest
}) {
  const variantClass = variant === 'primary' ? '' : `btn-${variant}`
  const sizeClass = size === 'sm' ? 'btn-sm' : ''
  const classes = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ')

  if (as === 'link') {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (as === 'a') {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
