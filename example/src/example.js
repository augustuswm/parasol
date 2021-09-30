import Parasol, { Parasol2 } from './../../dist/bundle.esm';

let Box = function ({ getRefProp, getTabIndex, label }) {
  return <div className="box">
    <a href={`#${label}`} {...getRefProp()} {...getTabIndex()}>
      {label}
    </a>
  </div>;
};

let App = function () {
  return <React.Fragment>
    <h1>Parasol</h1>
    <Parasol breakpoints={[[1500, 6], [1200, 5], [900, 4], [600, 3], [0, 2]]}>
      {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => {
          return <Box key={i} label={i} />;
        })
      }
    </Parasol>
    <h1>Parasol2</h1>
    <Parasol2 breakpoints={[[1500, 6], [1200, 5], [900, 4], [600, 3], [0, 2]]}>
      {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => {
          return <Box key={i} label={i} />;
        })
      }
    </Parasol2>
  </React.Fragment>;
};

ReactDOM.render(
  <App />,
  document.getElementById('example')
);