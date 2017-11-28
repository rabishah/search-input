import React, { Component } from 'react';
import Select from 'react-select';

import { getSuggestions } from './Api';
import 'react-select/dist/react-select.css';

class Option extends Component {
  constructor() {
    super();
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
  }
  
	handleMouseEnter (event) {
		this.props.onFocus(this.props.option, event);
	}
  
  handleMouseMove (event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
  }

  render() {
    const { option, inputValue } = this.props;

    return (
      <div 
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={option.label}
        dangerouslySetInnerHTML={{ __html: this.props.children.replace(inputValue, '<span class="green">$&</span>') }}
      />
    );
  }
}

export default class SearchInput extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      backspaceRemoves: true
    }
  }

  getOptions (input, callback) {
 		if (!input) {
   		return Promise.resolve({ options: [] });
		}

    return getSuggestions(input)
    .then((response) => {
      const options = response.map((d) => ({
        value: d,
        label: d,
      }));

      callback(null, { options });
    }).catch(() => {
      console.log('Error fetching suggestions');
      const options = [];
      callback(null, { options });
    });
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  render() {
    return (
      <Select.Async
        id="search-input"
        name="search-input" 
        value={this.state.value}
        multi={true}
        onChange={this.handleChange}
        loadOptions={this.getOptions}
        optionComponent={Option}
        placeholder="Search..."
        backspaceRemoves={this.state.backspaceRemoves}
      />
    );
  }
}