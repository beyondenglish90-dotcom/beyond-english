export default function Card({ className = '', hover = true, children, ...rest }) {
  const classes = ['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
