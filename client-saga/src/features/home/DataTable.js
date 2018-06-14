import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {Button, Glyphicon, FormControl} from 'react-bootstrap';
const json2csv = require('json2csv').parse;

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",


  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  width: '100%'
});


export default class DataTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      newAnnotations: {},
      newOrders: {},
      editing: false
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    this.props.switchPageOrder(result.source.index, result.destination.index)
    // this.props.setReorder(this.props.pages, result.source.index, result.destination.index)
  }


  edit() {
    this.setState({
      editing: true
    })
  }

  submit() {
    this.props.submitChange(this.state.newAnnotations, this.state.newOrders)
    this.setState({
      editing: false
    })
  }

  cancel() {
    this.setState({
      editing: false
    })
  }

  static propTypes = {

  };

  handleAnnotationChange(page, e) {
    if (page.annotation != e.target.value) {
      this.state.newAnnotations[page.id] = e.target.value
    }
    this.setState({
      newAnnotations: this.state.newAnnotations
    })
  }

  handleOrderChange(page, e) {
    if (page.order != e.target.value) {
      this.state.newOrders[page.id] = e.target.value
    }
    this.setState({
      newOrders: this.state.newOrders
    })
  }


  download() {
    let data, filename, link;

    let columns = ['order', 'name', 'annotation']

    for (var i = 0; i < this.props.columns.length; i++) {
      columns.push(this.props.columns[i])
    }
    let pages = JSON.parse(JSON.stringify(this.props.pages))
    for (var i = 0; i < pages.length; i++) {
      for (var j = 0; j < pages[i].likeHistoryArray.length; j++) {
        pages[i][pages[i].likeHistoryArray[j].date] = pages[i].likeHistoryArray[j].count
      }
    }
    console.log(pages)
    const opts = { 
      fields: columns
    };
    try {
      let csv = json2csv(pages, opts);
      if (csv == null) return;

      filename = 'export.csv';

      if (!csv.match(/^data:text\/csv/i)) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    } catch (err) {
      console.error(err);
    }
  }


  render() {
    return (
      <div className='data-container'>
        <div className='buttons-bar'>
          <Button onClick={this.download.bind(this)}>Download CSV</Button> &nbsp;
          {this.state.editing ? (
            <span>
              <Button onClick={this.submit.bind(this)}>Submit</Button> &nbsp;
              <Button onClick={this.cancel.bind(this)}>Cancel</Button>
            </span>
          ) : (
            <Button onClick={this.edit.bind(this)}>Edit</Button>
          )}
        </div>
        

        <div className='head'>
          <div className='name'>name</div>
          <div className='col'>order no.</div>
          <div className='col'>annotation</div>
          {this.props.columns.map((column, index) => {
            if (index < 10) {
              return (
                <div key={column} className='col'>
                  {column}
                </div>
              )
            }
          })}
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.props.pages.map((page, index) => (
                  <Draggable key={page.id} draggableId={page.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div className='name'>
                          {page.name}
                        </div>
                        <div className='col'>
                          {this.state.editing ? (
                            <FormControl
                              className='edit-box'
                              type='text'
                              placeholder={page.order}
                              onChange={this.handleOrderChange.bind(this, page)} 
                            />
                          ) : (
                            <span>
                              {page.order}
                            </span>
                          )}
                           
                        </div>
                        <div className='col'>
                          {this.state.editing ? (
                            <FormControl
                              className='edit-box'
                              type='text'
                              placeholder={page.annotation}
                              onChange={this.handleAnnotationChange.bind(this, page)} 
                            />
                          ) : (
                            <span>
                              {page.annotation}
                            </span>
                          )}
                        </div>

                          {page.likeHistoryArray.map((history, index) => {
                            if (index < 10) {
                              return (
                                <div key={page.id + history.date} className='col'>

                                  {history.count}
                                </div>
                              )
                            }
                          })}
                       
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}
