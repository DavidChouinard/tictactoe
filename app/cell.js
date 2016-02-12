export default React.createClass({
  onClick: function() {
    if (this.props.symbol == null) {
      this.props.userPlayedMove([this.props.i, this.props.j]);
    }
  },
  render: function() {
    var symbol = "";
    if (this.props.symbol == "nought") {
      symbol = <svg viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><path d="M50,5C25.2,5,5,25.2,5,50s20.2,45,45,45s45-20.2,45-45S74.8,5,50,5z M50,85c-19.3,0-35-15.7-35-35s15.7-35,35-35   s35,15.7,35,35S69.3,85,50,85z"/></g></svg>;
    } else if (this.props.symbol == "cross") {
      symbol = <svg viewBox="0 0 46 46"><g><path d="M 39.3044 33.6081 L 28.7961 23.1071 L 39.3014 12.6082 C 40.8641 11.0464 40.8641 8.5149 39.3014 6.9536 C 37.7387 5.3928 35.2052 5.3928 33.6444 6.9536 L 23.1387 17.4531 L 12.6324 6.9536 C 11.0707 5.3928 8.5376 5.3923 6.9749 6.9541 C 5.4127 8.5154 5.4127 11.0469 6.9754 12.6082 L 17.4817 23.1071 L 6.9749 33.6081 C 5.4127 35.1689 5.4127 37.7009 6.9749 39.2616 C 7.7563 40.0425 8.7798 40.433 9.8039 40.433 C 10.828 40.433 11.8515 40.0425 12.6329 39.2616 L 23.1396 28.7607 L 33.6474 39.2616 C 34.4287 40.0425 35.4523 40.433 36.4759 40.433 C 37.4994 40.433 38.524 40.0425 39.3044 39.2616 C 40.8671 37.7009 40.8671 35.1689 39.3044 33.6081 Z"/></g></svg>;
    }

    return <td onClick={this.onClick} className={this.props.symbol == null ? "empty" : null}>{symbol}</td>;
  }
});
