function PixelPainter(width, height) {
  const _width = width;
  const _height = height;
  let brush = null;

  return {
    aseemble: assemble,
    getRandomHexColor: getRandomHexColor
  };

  function assemble() {
    let canvas = document.getElementById('pixelPainter');

    let swatch = buildGrid('swatch', 'swatchCell', 12, 8);
    setupSwatch(swatch);
    canvas.appendChild(swatch);

    let selectColor = document.createElement('div');
    selectColor.id = 'selectColor';
    canvas.appendChild(selectColor);

    let clearBtn = document.createElement('button');
    clearBtn.id = 'clearButton';
    clearBtn.innerText = 'Clear';
    clearBtn.addEventListener('click', clearGrid);
    canvas.appendChild(clearBtn);

    let eraseBtn = document.createElement('button');
    eraseBtn.id = 'eraseButton';
    eraseBtn.innerText = 'Erase';
    eraseBtn.addEventListener('click', function() {
      brush = 'white';
      document.getElementById('selectColor').style.background = brush;
    });
    canvas.appendChild(eraseBtn);

    let grid = buildGrid('grid', 'gridCell', _width, _height);
    setupGrid(grid);
    canvas.appendChild(grid);
  }

  function setupSwatch(swatch) {
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

  function setupGrid(grid) {
    let cells = grid.querySelectorAll('div.gridCell');
    // console.log(cells);
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', function() {
        // console.log(this.style.background);
        cells[i].style = 'background: ' + brush;
      });
      cells[i].addEventListener('mousemove', function() {
        console.log(arguments[0]);
        if (arguments[0].buttons === 1) {
          cells[i].style = 'background: ' + brush;
        }
      });
    }
  }

  function buildGrid(containerName, cellName, gridWidth, gridHeight) {
    let container = document.createElement('div');
    container.id = containerName;

    for (let i = 0; i < gridWidth; i++) {
      let row = document.createElement('div');
      row.className = 'row ' + i;
      for (let j = 0; j < gridHeight; j++) {
        let cell = document.createElement('div');
        cell.className = cellName + ' col ' + j;
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
      cells[i].style.background = 'white';
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
}

let pp = PixelPainter(10, 10);
pp.aseemble();
// document.body.style = 'background: #' + pp.getRandomHexColor();
