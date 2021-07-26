import React, { Component } from "react";
import { echo } from "components";

class ItemsLegend extends Component {
  handleRemoveItem = item => {};
  render() {
    const { items, allItems, onRemoveItem } = this.props;
    if (items.length === 0 || !allItems) {
      return null;
    }
    echo("ItemsLegend - render - props: ", this.props);
    var itemsRender = items.map((item, index) => {
      //
      const title = allItems.best[item]
        ? allItems.best[item].desc
        : allItems.others[item].desc;
      const value = item !== "Reality" ? item + " - " + title : title;
      return (
        <div
          className="group flex flex-no-wrap cursor-pointer items-center bg-white w-full text-gray-700 cursor-default text-sm font-sans mb-2 mr-2"
          key={item}
        >
          <div
            className="w-3 h-3 flex-none"
            style={{ backgroundColor: this.props.getLineColor(index) }}
          />
          <span
            className="ml-2 flex-grow truncate text-xs font-normal text-gray-600"
            title={title}
          >
            {value}
          </span>
          <button
            className="group-hover:opacity-50 opacity-0 flex-none w-4 h-4 ml-1 cursor-pointer text-sm bg-transparent"
            onClick={() => onRemoveItem(item)}
          >
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 1.6a8.4 8.4 0 100 16.8 8.4 8.4 0 000-16.8zm4.789 11.461L13.06 14.79 10 11.729l-3.061 3.06L5.21 13.06 8.272 10 5.211 6.939 6.94 5.211 10 8.271l3.061-3.061 1.729 1.729L11.728 10l3.061 3.061z" />
            </svg>
          </button>
        </div>
      );
    });

    return (
      <>
        {itemsRender}
        {this.props.children}
      </>
    );
  }
}

export { ItemsLegend };
