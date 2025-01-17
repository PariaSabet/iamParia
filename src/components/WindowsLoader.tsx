export function WindowsLoader() {
  return (
    <div className="windows-container">
      <div className="windows__bg">
        <div className="windows__bg--inner">
          <div className="windows__logo">
            <div className="windows__logo--inner red"></div>
            <div className="windows__logo--inner green"></div>
            <div className="windows__logo--inner blue"></div>
            <div className="windows__logo--inner yellow"></div>
          </div>
          <div className="windows__name">
            <p>Paria's Version</p>
            <div className="windows__name--inner">
              Windows<span>xp</span>
            </div>
          </div>
          <div className="windows__bg--loading">
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindowsLoader
