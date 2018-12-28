import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import './Game.scss';
import Hint from '../../Components/Hint';
import Results from '../../Components/Results';
import { connect } from 'react-redux';

export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHint: false,
      hint: '',
      hintsUsed: 0,
      hintsExhausted: false,
      pointsPossible: 3,
      totalPoints: 0,
      status: ''
    }
  }

  checkAnswer = (e) => {
    const { currentCountry } = this.props;

    const { innerText } = e.target
    if (innerText === currentCountry.name) {
      this.setState({
        status: 'Correct'
      })
    } else {
      this.setState({
        status: 'Wrong'
      })
    }
  }

  giveHint = () => {
    let { hintsUsed, pointsPossible } = this.state;
    const { outline, questions } = this.props.currentCountry;

    this.setState({
      showHint: true
    });
    
    if (hintsUsed === 0) {
      this.setState({
        hint: 'fact'
      });
    } 
    
    if (hintsUsed === 1) {
      this.setState({
        hint: 'outline'
      });
    }

    if (hintsUsed >= 2) {
      this.setState({
        hint: 'out of hints',
        hintsExhausted: true,
      })
    }

    this.setState({
      hintsUsed: hintsUsed + 1,
      pointsPossible: pointsPossible - 1,
    });
  }

  showButtons = () => {
    const { multipleChoice } = this.props.currentCountry

    if(multipleChoice !== undefined) {
      return multipleChoice.map(choice => {
        return (<div 
                  className='option-button button' 
                  key={choice}
                  name={choice}
                  onClick={this.checkAnswer}
                >
                  {choice}
                </div>)  
      })
    }
  }

  closeResults = () => {
    this.setState({
      hintsExhausted: false,
      hintsUsed: 0,
      pointsPossible: 3,
      status: ''
    });
  }

  addPoints = () => {
    const { status, pointsPossible, totalPoints } = this.state

    if(status === 'Correct'){
      const points = pointsPossible
      const totalPoints = totalPoints + points
      this.setState({ totalPoints })
    }
    else if(status === 'Wrong') {
      const points = totalPoints
      this.setState({totalPoints: points})
    }
  }

  hideHint = () => {
    this.setState({
      showHint: false
    });
  }

 getCountryFlagPath = () => {
    const { flag } = this.props.currentCountry;
    const flagUrl = `https://flagz4u.herokuapp.com${flag}`
    return flagUrl
  }

  render() {
    const choiceButtons = this.showButtons();
    const flagImage = this.getCountryFlagPath();

    const { correct, incorrect, pointsPossible, showHint, hint, totalPoints, status } = this.state;
    const { getCountry } = this.props;   
    const { name, facts, country_outline } = this.props.currentCountry;

    return (
      <div className='Game'>
        <div className='top-container'>
          <div className='account-area'>
            <div className='back-button'>
            </div>
            <h5 className='account-text'>Alex <strong>{totalPoints}</strong></h5>
          </div>
        </div>
        <div className='flag-main'>
          <img src={flagImage} className='flag-image'/>
        </div>
        <div className='hint-button' onClick={this.giveHint}>
          Hints: 2
        </div>
        
        { choiceButtons }

        { (status === 'Correct' || status === 'Wrong') &&
          <Results
            status={status}
            closeResults={this.closeResults}
            correctCountry={name}
            points={pointsPossible}
            addPoints={this.addPoints}
            totalPoints={totalPoints}
            getCountry={getCountry}
          />
        }
        
        {showHint && 
          <Hint 
            hideHint={this.hideHint} 
            hint={hint}
            outline={country_outline}
            fact={facts.country_fact}
          />
        }
      </div>
    );
  }
}

export const mapStateToProps = ({ user, currentCountry, usedCountries  }) => ({
  user, 
  currentCountry, 
  usedCountries,   
});

export const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Game);
