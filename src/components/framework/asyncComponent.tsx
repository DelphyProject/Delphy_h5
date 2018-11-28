import React, { Component } from 'react';

interface AsyncComponentState {
  component: any;
}

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component<{}, AsyncComponentState> {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
