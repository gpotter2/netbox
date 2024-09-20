import { getElements } from '../util';

/**
 * 'Layout' widget handler.
 */

function getLayoutValue(element: HTMLAnchorElement) {
  /*
   * Get the JSON value of the handler.
   */
  let content = element.getElementsByTagName("input")[0].value;
  return JSON.parse(content);
}

function setLayoutValue(element: HTMLAnchorElement, value: object) {
  /*
   * Save the JSON value of the handler.
   */
  element.getElementsByTagName("input")[0].value = JSON.stringify(value);
}

function refreshLayoutWidget(element: HTMLAnchorElement) {
  /*
   * Populate a layout widget
   */
  const layout = getLayoutValue(element);
  const contentHost = element.getElementsByClassName("lyt")[0];
  /*
   * We are dynamically generating the following format:
   * <div class="col">
   *    <table class="table">
   *      <tr>
   *        <td><span><button></button></span></td>
   *        ...
   *      </tr>
   *      <tr>
   *        <td><span><button></button></span></td>
   *        ...
   *      </tr>
   *    ...
   *    </table>
   * </div>
   * 
   * The <span> is a bootstrap tooltip.
   */
  // Empty previous children
  while (contentHost.firstChild) if (contentHost.lastChild) contentHost.removeChild(contentHost.lastChild);
  // Populate
  for (const col of layout.cols) {
    const elt = document.createElement('div');
    elt.setAttribute('class', `col col-auto ${col["mclass"] || ""} ${col["class"] || ""}`);
    const table = document.createElement('table');
    table.setAttribute('class', "table");
    for (let r = 0; r < col.rows; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < col.cols; c++) {
        const td = document.createElement('td');
        const ifacename = document.createElement('span');
        ifacename.setAttribute('data-toogle', 'tooltip');
        ifacename.setAttribute('title', 'Hey');
        const iface = document.createElement('button');
        iface.setAttribute('class', `btn btn-secondary ${col["cclass"] || ""}`);
        iface.setAttribute('type', 'button');
        ifacename.appendChild(iface);
        td.appendChild(ifacename);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    elt.appendChild(table);
    contentHost.appendChild(elt);
  }
}

function addEditLine(element: HTMLAnchorElement, parent: Element, col: any) {
  /*
   * We are dynamically generating the following format:
   * <li class="list-group-item d-flex justify-content-between align-items-center">
   *   <div class="row">
   *     <div class="col">... <input class="form-control" type="number" /></div>
   *     <div class="col">... <input class="form-control" type="number" /></div>
   *   </div>
   * </li>
   */
  // Get root element
  const elt = document.createElement('li');
  elt.setAttribute('class', "list-group-item d-flex align-items-center row justify-content-between ps-2");

  // Add col macro
  const addcol = (elt: HTMLElement, x: HTMLElement, colclass: string) => {
    const newcol = document.createElement('div');
    newcol.setAttribute('class', 'col ' + colclass + ' d-flex align-items-center');
    newcol.appendChild(x);
    elt.appendChild(newcol);
  };

  // Add icon macro
  const addico = (x: HTMLElement, iclass: string) => {
    const icon = document.createElement('i');
    icon.setAttribute('class', 'mdi ' + iclass);
    x.appendChild(icon);
  }

  // Cols
  const cowelt = document.createElement('div');
  cowelt.setAttribute('class', 'row');
  addcol(elt, cowelt, 'col-auto');

  // Cols label
  const colslabel = document.createElement('label');
  colslabel.setAttribute('class', 'form-label mb-0');
  colslabel.setAttribute('for', 'cols');
  colslabel.textContent = "Cols";
  addcol(cowelt, colslabel, 'col-auto');

  // Cols field
  const colsinput: HTMLInputElement = document.createElement('input');
  colsinput.setAttribute('type', "number");
  colsinput.setAttribute('class', "form-control");
  colsinput.setAttribute('min', "1");
  colsinput.setAttribute('max', "24");
  colsinput.setAttribute('id', "cols");
  colsinput.setAttribute('value', col.cols);
  colsinput.addEventListener('input', (event) => {
    // Update json
    let layout = getLayoutValue(element);
    layout.cols = layout.cols.filter((x: any) => {
      if (x.guid == col.guid) x.cols = (event.target as HTMLInputElement).value;
      return x;
    });
    setLayoutValue(element, layout);
    // Refresh display
    refreshLayoutWidget(element);
  });
  addcol(cowelt, colsinput, 'col-auto');

  // Rows
  const rowelt = document.createElement('div');
  rowelt.setAttribute('class', 'row');
  addcol(elt, rowelt, 'col-auto me-auto');

  // Rows label
  const rowslabel = document.createElement('label');
  rowslabel.setAttribute('class', 'form-label mb-0');
  rowslabel.setAttribute('for', 'rows');
  rowslabel.textContent = "Rows";
  addcol(rowelt, rowslabel, 'col-auto');

  // Rows field
  const rowsinput: HTMLInputElement = document.createElement('input');
  rowsinput.setAttribute('type', "number");
  rowsinput.setAttribute('class', "form-control");
  rowsinput.setAttribute('min', "1");
  rowsinput.setAttribute('max', "4");
  rowsinput.setAttribute('id', "rows");
  rowsinput.setAttribute('value', col.rows);
  rowsinput.addEventListener('input', (event) => {
    // Update json
    let layout = getLayoutValue(element);
    layout.cols = layout.cols.filter((x: any) => {
      if (x.guid == col.guid) x.rows = (event.target as HTMLInputElement).value;
      return x;
    });
    setLayoutValue(element, layout);
    // Refresh display
    refreshLayoutWidget(element);
  });
  addcol(rowelt, rowsinput, 'col-auto');

  // Buttons
  const buttons = document.createElement('div');
  buttons.setAttribute('class', "row justify-content-end w-100 flex-nowrap mt-3 mt-xl-0");

  // https://getbootstrap.com/docs/5.3/components/button-group/#checkbox-and-radio-button-groups
  const addsel = (elt: HTMLElement, type: string, mdiicon: string, value: string, attr: string) => {
    // Add radio input
    const inp = document.createElement('input');
    inp.setAttribute('class', "btn-check");
    inp.setAttribute('type', type);
    inp.setAttribute('name', "align" + col.guid + attr);
    inp.setAttribute('id', value + col.guid + attr);
    if (col[attr].includes(value)) inp.setAttribute('checked', '');
    // Add the button that is actually shown
    const btn = document.createElement('label');
    btn.setAttribute('class', "btn btn-outline-primary");
    btn.setAttribute('name', "align" + col.guid + attr);
    btn.setAttribute('for', value + col.guid + attr);
    addico(btn, mdiicon);
    elt.append(inp);
    elt.append(btn);
    // Event
    btn.addEventListener('click', () => {
      // Update json
      let layout = getLayoutValue(element);
      layout.cols = layout.cols.filter((x: any) => {
        if (x.guid == col.guid) {
          if (type == 'radio') x[attr] = value;
          else {
            if (x[attr].includes(value)) {
              x[attr] = x[attr].trim().split(" ").filter((x: string) => x != value).join(" ");
            } else {
              x[attr] = x[attr] + " " + value;
            }
          }
        }
        return x;
      });
      setLayoutValue(element, layout);
      // Refresh display
      refreshLayoutWidget(element);
    });
  };
  // Alignment selector
  const aligninput = document.createElement('div');
  aligninput.setAttribute('class', "btn-group");
  aligninput.setAttribute('role', "group");
  // Spawn 3 buttons
  addsel(aligninput, "radio", "mdi-format-vertical-align-top", "align-self-start", "class");
  addsel(aligninput, "radio", "mdi-format-vertical-align-center", "align-self-center", "class");
  addsel(aligninput, "radio", "mdi-format-vertical-align-bottom", "align-self-end", "class");
  addcol(buttons, aligninput, 'col-auto');
  // Justify selector
  const justifyinput = document.createElement('div');
  justifyinput.setAttribute('class', "btn-group");
  justifyinput.setAttribute('role', "group");
  // Spawn 3 buttons
  addsel(justifyinput, "checkbox", "mdi-format-horizontal-align-left", "ms-auto", "mclass");
  addsel(justifyinput, "checkbox", "mdi-format-horizontal-align-right", "me-auto", "mclass");
  addcol(buttons, justifyinput, 'col-auto');

  // Trash button
  const trashbtn = document.createElement('button');
  addcol(buttons, trashbtn, 'col-auto')
  trashbtn.setAttribute('class', 'btn btn-outline-danger');
  trashbtn.setAttribute('type', 'button');
  trashbtn.addEventListener('click', () => {
    // Remove from json
    let layout = getLayoutValue(element);
    layout.cols = layout.cols.filter((x: any) => x.guid != col.guid);
    setLayoutValue(element, layout);
    // Remove from DOM
    parent.removeChild(elt);
    // Refresh display
    refreshLayoutWidget(element);
  });
  addico(trashbtn, 'mdi-delete');
  addcol(elt, buttons, 'col-12 col-xl-auto');

  // Append to DOM
  parent.appendChild(elt);
}

function initLayoutWidgetEdit(element: HTMLAnchorElement) {
  /*
   * Populate a layout widget edit function
   */
  const layout = getLayoutValue(element);
  const contentHost = element.getElementsByClassName("layout-widg-edit-elements")[0];
  for (const col of layout.cols) {
    addEditLine(element, contentHost, col);
  }
}

export function initDeviceLayoutWidget(): void {
  /*
   * Main entry point
   */
  for (const element of getElements<HTMLAnchorElement>('div.layout-widg')) {
    if (element !== null) {
      // Render
      refreshLayoutWidget(element);
    }
  }
  for (const element of getElements<HTMLAnchorElement>('div.layout-widg-edit')) {
    if (element !== null) {
      // Add GUIDs for unique identification
      {
        // Add guids
        let layout = getLayoutValue(element);
        for (let col of layout.cols) {
          col["guid"] = Math.floor(Math.random() * 1e5);
        }
        setLayoutValue(element, layout);
      }
      // Add edition menu
      initLayoutWidgetEdit(element);
      // Hook add button
      element.getElementsByClassName("layout-widg-edit-addbtn")[0].addEventListener('click', () => {
        let newcol = { rows: 2, cols: 2, guid: Math.floor(Math.random() * 1e5), class: "align-self-center", mclass: "me-auto ms-auto", cclass: "wide" };
        // Add to JSON
        let layout = getLayoutValue(element);
        layout.cols.push(newcol);
        setLayoutValue(element, layout);
        // Add to DOM
        const contentHost = element.getElementsByClassName("layout-widg-edit-elements")[0];
        addEditLine(element, contentHost, newcol);
        // Refresh display
        refreshLayoutWidget(element);
      });
    }
  }
}
