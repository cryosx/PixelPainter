function PixelPainter(width, height) {
  const _width = width;
  const _height = height;
  const defaultColor = 'white';
  let brush = defaultColor;
  let fillState = false;

  return {
    build: build,
    getRandomHexColor: getRandomHexColor
  };

  function build() {
    let canvas = document.getElementById('pixelPainter');

    let selectColor = document.createElement('div');
    selectColor.id = 'selectColor';
    canvas.appendChild(selectColor);

    let swatch = buildGrid('swatch', 'swatchCell', 8, 12);
    setupSwatchCells(swatch);
    canvas.appendChild(swatch);

    canvas.appendChild(createButton(clearGrid, 'clearButton', 'Clear'));
    canvas.appendChild(
      createButton(
        function() {
          brush = defaultColor;
          document.getElementById('selectColor').style.background = brush;
        },
        'eraseButton',
        'Erase'
      )
    );
    canvas.appendChild(createButton(toggleFill, 'fillButton', 'Fill'));

    let grid = buildGrid('grid', 'gridCell', _width, _height);
    setupGridCells(grid);
    canvas.appendChild(grid);
  }

  function createButton(func, id, text) {
    let btn = document.createElement('button');
    btn.id = id;
    btn.innerText = text;
    btn.addEventListener('click', func);
    return btn;
  }

  function toggleFill() {
    fillState = !fillState;
  }

  function setupSwatchCells(swatch) {
    let cells = swatch.querySelectorAll('div.swatchCell');
    for (let i = 0; i < cells.length; i++) {
      cells[i].style = 'background: #' + getRandomHexColor();
      cells[i].addEventListener('click', function() {
        // console.log(this.style.background);
        brush = this.style.background;
        document.getElementById('selectColor').style.background = brush;
        // console.log(brush);
      });
    }
  }

  function setupGridCells(grid) {
    let cells = grid.querySelectorAll('div.gridCell');
    // console.log(cells);
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', function() {
        // console.log(this.style.background);
        // console.log(arguments[0]);
        // console.log(arguments[0].path[0].classList[2]);
        // console.log(arguments[0].path[1].classList[1]);

        if (fillState) {
          console.log(arguments[0].path);
          fill(
            arguments[0].path[0].classList[2],
            arguments[0].path[1].classList[1]
          );
        }
        cells[i].style.background = brush;
      });
      cells[i].addEventListener('mousemove', function() {
        // console.log(arguments[0]);
        if (arguments[0].buttons === 1) {
          cells[i].style.background = brush;
        }
      });
    }
  }

  function fill(col, row) {
    let rowNum = Number.parseInt(row);
    let colNum = Number.parseInt(col);
    let cells = document.querySelectorAll('div.gridCell');
    let targetColor = cells[getCellPosition(rowNum, colNum)].style.background;
    console.log(targetColor);

    // console.log(cells[1]);
    // console.log(rowNum * _width + colNum);
    console.log(cells[rowNum * _width + colNum]);
    // console.log(cell + ' : ' + row);
    fillHelper(cells, rowNum, colNum, targetColor);
  }

  function fillHelper(cells, row, col, targetColor) {
    // debugger;
    console.log(targetColor);
    console.log(cells[getCellPosition(row, col)]);
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
      row.className = 'row ' + i;
      for (let j = 0; j < gridWidth; j++) {
        let cell = document.createElement('div');
        cell.className = cellName + ' col ' + j;
        cell.style.background = defaultColor;
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

let pp = PixelPainter(10, 10);
pp.build();
// document.body.style = 'background: #' + pp.getRandomHexColor();
