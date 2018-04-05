function PixelPainter(width, height) {
  const _width = width;
  const _height = height;
  const defaultColor = 'white';
  const defaultBrushColor = 'black';
  let brush = defaultBrushColor;
  let fillState = false;
  let gridData = null;
  let shareData = null;
  let shareUrl = null;

  return {
    build: build,
    getRandomHexColor: getRandomHexColor
  };

  function build() {
    let canvas = document.getElementById('pixelPainter');

    let swatchDiv = document.createElement('div');
    swatchDiv.id = 'swatchContainer';
    canvas.appendChild(swatchDiv);

    let selectColor = document.createElement('div');
    selectColor.id = 'selectColor';
    selectColor.style.background = defaultBrushColor;
    swatchDiv.appendChild(selectColor);

    let swatch = buildGrid('swatch', 'swatchCell', 8, 12);
    setupSwatchCells(swatch);
    swatchDiv.appendChild(swatch);

    let gridDiv = document.createElement('div');
    gridDiv.id = 'gridContainer';
    canvas.appendChild(gridDiv);

    let grid = buildGrid('grid', 'gridCell', _width, _height);
    setupGridCells(grid);
    gridDiv.appendChild(grid);

    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'buttons';
    gridDiv.appendChild(buttonDiv);

    buttonDiv.appendChild(
      createButton(clearGrid, 'clearButton', 'button', 'Clear')
    );
    buttonDiv.appendChild(
      createButton(
        function() {
          brush = defaultColor;
          document.getElementById('selectColor').style.background = brush;
        },
        'eraseButton',
        'button',
        'Erase'
      )
    );
    buttonDiv.appendChild(
      createButton(toggleFill, 'fillButton', 'button', 'Fill')
    );
    buttonDiv.appendChild(
      createButton(saveData, 'saveButton', 'button', 'Save')
    );
    buttonDiv.appendChild(
      createButton(loadData, 'loadButton', 'button', 'Load')
    );
    // buttonDiv.appendChild(
    //   createButton(share, 'shareButton', 'button', 'Share')
    // );

    // let url = new URL(location);
    // // console.log(url);

    // if (url.searchParams.has('share')) {
    //   shareData = url.searchParams.get('share');
    //   loadShare(shareData);
    // }
  }

  // function share() {
  //   saveData();
  //   console.log(JSON.stringify(Array.from(gridData.entries())));
  //   shareData = btoa(JSON.stringify(Array.from(gridData.entries())));
  //   console.log(shareData);
  //   shareUrl = new URL(location);
  //   shareUrl.searchParams.set('share', shareData);
  //   console.log(shareUrl.href);
  // }

  function save() {
    gridData = new Map();
    let cells = document.querySelectorAll('div.gridCell');
    cells.forEach(function(elem) {
      if (gridData.has(elem.style.background)) {
        gridData.get(elem.style.background).push({
          row: elem.dataset.row,
          col: elem.dataset.col,
          num: elem.dataset.num
        });
      } else {
        gridData.set(elem.style.background, []);
        gridData.get(elem.style.background).push({
          row: elem.dataset.row,
          col: elem.dataset.col,
          num: elem.dataset.num
        });
      }
    });
  }

  function saveData() {
    save();
    localStorage.gridData = JSON.stringify(Array.from(gridData.entries()));
  }

  function loadData() {
    gridData = new Map(JSON.parse(localStorage.gridData));
    let cells = document.querySelectorAll('div.gridCell');
    for (let entry of gridData.entries()) {
      entry['1'].forEach(function(elem) {
        cells[elem.num].style.background = entry['0'];
      });
    }
  }

  // function loadShare(shareData) {
  //   console.log(atob(shareData));
  //   gridData = new Map(JSON.parse(atob(shareData)));
  //   console.log(gridData);

  //   let cells = document.querySelectorAll('div.gridCell');
  //   for (let entry of gridData.entries()) {
  //     entry['1'].forEach(function(elem) {
  //       cells[elem.num].style.background = entry['0'];
  //     });
  //   }
  // }

  function createButton(func, id, className, text) {
    let btn = document.createElement('button');
    btn.id = id;
    btn.className = className;
    btn.innerText = text;
    btn.addEventListener('click', func);
    return btn;
  }

  function toggleFill() {
    fillState = !fillState;
    if (fillState) {
      this.style.background = 'black';
      this.style.color = 'white';
    } else {
      this.style.background = 'white';
      this.style.color = 'black';
    }
  }

  function setupSwatchCells(swatch) {
    let cells = swatch.querySelectorAll('div.swatchCell');
    for (let i = 0; i < cells.length; i++) {
      cells[i].style = 'background: #' + getRandomHexColor();
      cells[i].addEventListener('click', function() {
        brush = this.style.background;
        document.getElementById('selectColor').style.background = brush;
      });
    }
  }

  function setupGridCells(grid) {
    let cells = grid.querySelectorAll('div.gridCell');
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', function(event) {
        if (fillState) {
          fill(event.target.dataset.row, event.target.dataset.col);
        }
        cells[i].style.background = brush;
      });
      cells[i].addEventListener('mousemove', function() {
        if (event.buttons === 1) {
          cells[i].style.background = brush;
        }
      });
    }
  }

  function fill(row, col) {
    let rowNum = Number.parseInt(row);
    let colNum = Number.parseInt(col);
    let cells = document.querySelectorAll('div.gridCell');
    let targetColor = cells[getCellPosition(rowNum, colNum)].style.background;
    if (cells[getCellPosition(rowNum, colNum)].style.background !== brush) {
      fillHelper(cells, rowNum, colNum, targetColor);
    }
  }

  function fillHelper(cells, row, col, targetColor) {
    // debugger;

    if (
      getCellPosition(row, col) >= 0 &&
      getCellPosition(row, col) <= _height * _width - 1
    ) {
      let cell = cells[getCellPosition(row, col)];
      if (cell.style.background === targetColor) {
        cell.style.background = brush;
        fillHelper(cells, row - 1, col, targetColor);
        fillHelper(cells, row, col + 1, targetColor);
        fillHelper(cells, row + 1, col, targetColor);
        fillHelper(cells, row, col - 1, targetColor);
      }
    }
  }

  function getCellPosition(row, col) {
    if (typeof col === 'number' && typeof row === 'number') {
      return row * _width + col;
    }
  }

  function buildGrid(containerName, cellName, gridWidth, gridHeight) {
    let container = document.createElement('div');
    container.id = containerName;

    for (let i = 0; i < gridHeight; i++) {
      let row = document.createElement('div');
      row.className = 'row';
      row.dataset.row = i;
      for (let j = 0; j < gridWidth; j++) {
        let cell = document.createElement('div');
        cell.className = cellName + ' col';
        cell.style.background = defaultColor;
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.dataset.num = i * _width + j;
        row.appendChild(cell);
      }
      container.appendChild(row);
    }
    return container;
  }

  function clearGrid() {
    let grid = document.getElementById('grid');
    let cells = grid.querySelectorAll('div.gridCell');
    // console.log(cells);
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.background = defaultColor;
    }
  }

  function getRandomHexColor() {
    let color = '';
    for (let i = 0; i < 3; i++) {
      color += Math.round(Math.random() * 255)
        .toString(16)
        .padStart(2, '0');
    }
    return color;
  }
  function getHSLGraident() {
    let hslColors = [];
  }
}

let pp = PixelPainter(40, 40);
pp.build();
// document.body.style = 'background: #' + pp.getRandomHexColor();
