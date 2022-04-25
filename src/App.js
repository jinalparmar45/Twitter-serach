import React, { Component } from 'react';
import { FaSearch , FaTwitter} from 'react-icons/fa';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';


class App extends Component {
  state = {
    error: false,
  }
  search = (e) => {
    // console.log("changed :", e.target.value, e.target.value.charAt(0));
    if (e.target.value.charAt(0) === "@" || e.target.value.charAt(0) === "#") {
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  
  }

  checkEnter = (e) => {
    // console.log("keypress:", e.keyCode);
    if (e.keyCode === 13) {
        if(this.searchtext.value.trim()){
          this.EnterBtn.focus()
        }else{
          this.setState({ error: true });
        }
      
      //this.searchbtn();
    }
  }

  searchbtn = () => {
    console.log("search ", this.searchtext.value,);

    if (this.searchtext.value.trim() !== "" ) {
    const searchText = (this.searchtext.value.charAt(0)=== "#")? this.searchtext.value.replace("#", "%23") : (this.searchtext.value.charAt(0)=== "@") ? this.searchtext.value.replace("@", "") : this.searchtext.value
    //var Twitter = require('twitter');
    var config = require('./twitter_config.js');

    // encoding consumer key and secret
   console.log(" encodes ::" ,encodeURI(config.consumer_key), encodeURI(config.consumer_secret));
    console.log("base64 encode : ",btoa(encodeURI(config.consumer_key) + ":" + encodeURI(config.consumer_secret)) );
    
    
    var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");

const requestOptions = {
  method: 'POST',
  headers: {
    'Authorization': "Basic "+btoa(encodeURI(config.consumer_key) + ":" + encodeURI(config.consumer_secret)),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: urlencoded,
  redirect: 'follow'
};
const proxyurl = "https://cors-anywhere.herokuapp.com/";
fetch(proxyurl+"https://api.twitter.com/oauth2/token", requestOptions)
  .then(response => response.text())
  .then(result =>{ console.log(" result for suthorization ::", result)
    const oauth2 = JSON.parse(result).access_token;
    const requestOptions1 = {
      method: 'GET',
      headers: {
        'Authorization': "Bearer "+oauth2,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      //body: urlencoded,
      redirect: 'follow'
    };

    fetch(proxyurl+"https://api.twitter.com/1.1/search/tweets.json?q="+searchText+"&count=10&result_type=recent&lang=en", requestOptions1)
  .then(response => response.text())
  .then(result1 => {console.log("tweets :: ", result1)
  this.setState({result : JSON.parse(result1),error:false})
})
  .catch(error => {console.log('error', error)
  this.setState({result : {},error:true})
});

})
  .catch(error => console.log('error', error));
   
}
  }
  render() {
    const classes = makeStyles(theme => ({
      root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      },
    }));
    console.log("this.state::", this.state);
    //JSON.stringify(this.state.result)
    return (
      <div className="App">
        <div className="App-header">
          <div>
            <h3>
              Twitter search Engine
            </h3>

            <h5>Please Use @ for username and # for hashtag search</h5>
          </div>
          <FaTwitter/>
          <input type="text" className="search-input"
          placeholder="Search"
          ref={(input) => { this.searchtext = input; }}
          //onChange={this.search} 
          onKeyDown={this.checkEnter} />

          <button
            className="search-button"
            ref={(input) => { this.EnterBtn = input; }}
            onClick={this.searchbtn}
          > <FaSearch />
          </button>
          {
            this.state.error && <p>use @ for username and # for hashtags search</p>
          }
        </div>
        
              <List className={classes.root}>
                {this.state.result && this.state.result.statuses &&
                  this.state.result.statuses.map(element =>{
                    return <ListItem key={element.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <img src={element.user.profile_image_url_https} alt="profile"/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={element.text} secondary={element.created_at} />
                    </ListItem>      
                  }) 
                }
                {
                  (this.state.result && this.state.result.statuses.length === 0) && <p>No data Found</p> 
                }
            </List>
      </div>
    );
  }
}


export default App;

