import React from 'react';  
import '../App.css'; 

const style = {
  fontColor: 'red', 
}

class Popup extends React.Component {  

  render() {  
    return (  
      <div className='popup'>  
          
          <h1 style={style}>{this.props.text}</h1>  
          {this.props.openPopup}
          <button onClick={this.props.closePopup}>Go back</button>  
 
      </div>  
    );  
  }  
}  

export default Popup;