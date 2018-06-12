import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  display: "flex",
  justifyContent: "space-between",


  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",
  border: "1px solid grey",

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
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.props.setReorder(this.props.pages, result.source.index, result.destination.index)
  }

  static propTypes = {

  };

  render() {
    return (
      <div>
        <div className='head'>
          <div>name</div>
          <div>order</div>
          <div>annotation</div>
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
                           {page.order}
                        </div>
                        <div className='col'>
                          {page.annotation}
                        </div>

                          {page.likeHistoryArray.map((history, index) => {
                            if (index < 10) {
                              return (
                                <div key={page.id + history.date} className='col'>
                                  {history.date}
                                  <br />
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
