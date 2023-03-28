import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AddNew } from "./AddNew";
import { dragDb } from "../axios";

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  //   const sourceClone = [...source];
  const destClone = [...destination];
  const toAdd = source[droppableSource.index];
  destClone.splice(droppableDestination.index, 0, toAdd);
  return destClone;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

export const DraggableList = () => {
  const [sourceData, setSourceData] = useState([]);
  const [targetData, setTargetData] = useState([]);
  const [actions, setActions] = useState([]);

  const getAndSetData = async () => {
    const { data } = await axios({
      url: "http://localhost:3000/drag",
      method: "GET",
    });
    console.log({ data });
    const { object1: source, object2: target } = data;
    setSourceData(source);
    setTargetData(target);
  };

  const handleSave = async () => {
    const { data } = await axios({
      url: "http://localhost:3000/drag",
      method: "PATCH",
      data: { source: sourceData, target: targetData },
    });
    console.log({ data });
  };

  const handleUndo = () => {
    const lastActionIdx = [...actions].pop();
    const targetClone = [...targetData];
    targetClone.splice(lastActionIdx, 1);
    setTargetData(targetClone);
    setActions(actions.slice(0, actions.length - 1));
  };

  const handleReset = async () => {
    getAndSetData();
  };

  const handleClearAll = async () => {
    const { data } = await dragDb({
      url: "/drag",
      method: "DELETE",
    });

    if (data.status === "success") {
      setSourceData([]);
      setTargetData([]);
    }
  };

  useEffect(() => {
    getAndSetData();
  }, []);

  function onDragEnd(result) {
    console.log(result);
    const { source, destination } = result;
    setActions((prev) => [...prev, source.index]);

    // dropped outside the list
    if (!destination) return;
    if (destination.droppableId === "1") return;

    // const idx = +source.index
    if (source.droppableId === destination.droppableId) {
      const reOrdered = reorder(targetData, source.index, destination.index);
      setTargetData(reOrdered);
      return;
    }
    const moved = move(sourceData, targetData, source, destination);
    setTargetData(moved);
  }

  return (
    <>
      <div>
        <AddNew setSourceData={setSourceData} setTargetData={setTargetData} />
      </div>
      <div className="d-flex gap-3">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* SOURCE */}
          <div className="">
            <h3 className="text-primary">SOURCE</h3>
            <Droppable isDropDisabled key={1} droppableId={`1`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {sourceData.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {item}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* TARGET */}
          <div className="">
            <h3 className="text-primary">TARGET</h3>
            <Droppable key={2} droppableId={`2`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {targetData.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {item}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
      <button
        className="btn btn-primary mt-3 mx-3 px-4 py-2"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="btn btn-success mt-3 mx-3 px-4 py-2"
        onClick={handleUndo}
        disabled={!actions.length}
      >
        Undo
      </button>
      <button
        className="btn btn-danger mt-3 mx-3 px-4 py-2"
        onClick={handleReset}
      >
        Reset
      </button>
      <button
        className="btn btn-danger mt-3 mx-3 px-4 py-2"
        onClick={handleClearAll}
      >
        Clear All
      </button>
    </>
  );
};
