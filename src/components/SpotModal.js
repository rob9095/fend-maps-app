import React, { Component } from 'react';
import { Modal } from 'antd';
import ForcastTable from './ForcastTable';

export default class SpotModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: true,
    }
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    })
    this.props.onClose()
  }

  render(){
    const { name, county, id } = this.props
    return(
        <Modal
          title={name + ' - ' + county}
          style={{ top: document.documentElement.clientWidth >= 740 ? '10%' : 0 }}
          visible={this.state.showModal}
          afterClose={this.closeModal}
          cancelButtonProps={{style:{display: 'none'}}}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          okText={'Close'}
        >
          <div>
            <ForcastTable
              id={id}
              county={county}
            />
          </div>
        </Modal>
    )
  }
}
