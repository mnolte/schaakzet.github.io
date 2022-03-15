!(function () {
  // TODO these constants should be moved to a config file, are also in chess-matches.js
  const CSS_Boards = /* css */ `#boards{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,15vh));gap:1em}`;
  const DIV_Boards = /* html */ `<div id="boards"></div>`;

  // ********************************************************** <chess-boards>
  customElements.define(
    "chess-boards",
    class extends HTMLElement {
      constructor() {
        super().attachShadow({ mode: "open" }).innerHTML = `<style>${CSS_Boards}</style>${DIV_Boards}`;
      }
      connectedCallback() {
        setTimeout(() => this.render()); // wait till innerHTML is parsed by the browser
      }
      // ======================================================== <chess-boards>.render
      render() {
        let boardElements = this.innerHTML
          .split("\n")
          .map((fen) => {
            fen = fen.trim();
            if (fen == "") return false;
            else
              return CHESS.createBoardElement({
                fen,
                disabled: true,
                onclick: (evt) => {
                  let chessboard = document.querySelector("chess-board");
                  chessboard.fen = fen;
                }, // onclick
              });
          })
          .filter(Boolean); // disregard empty lines

        this.shadowRoot.querySelector("#boards").append(...boardElements); // Object.assign #boards
        
      } // matchmoves2boards()
      // ======================================================== <chess-boards>
    } // class
  ); // customElements.define
  // ********************************************************** end IIFE
})();