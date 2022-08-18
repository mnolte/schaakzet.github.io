!(function () {

  // The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
  // With strict mode, you can not, for example, use undeclared variables.
  "use strict";

  // <chess-match> encapsulates <chess-board>
  // manages players
  // communicates with server
  function log(...args) {
    console.log("%c chess-match ", "background:green;color:yellow", ...args);
  }

  // ********************************************************** CSS for Full Screen
  const CSS_Match = /* css */ `:fullscreen {background-color: beige}`;
  // ********************************************************** define <chess-match>
  customElements.define(
    "chess-match",
    class extends window.CHESS.ChessBaseElement {
      // todo create shadowDOM?
      // ================================================== connectedCallback
      connectedCallback() {
        super.connectedCallback();
        this.render();

        setTimeout(() => {
          let match_guid = localStorage.getItem(window.CHESS.__MATCH_GUID__);
          if (match_guid) {
            this.resumeMatch(match_guid);
          } else {
            this.createMatch(); // call back-end for match_guid, then this.initGame(match_guid)
          }
          this.addListeners();
          this.listen2matchmoves();
        });
      }
      // ================================================== get chessboard
      get chessboard() {
        // todo find chessboard inside shadowDOM?
        if (this._chessboard) return this._chessboard;
        return (this._chessboard = document.querySelector("chess-board") || console.error("Missing chess-board"));
      }
      // ================================================== render
      render() {
        this.append(
          Object.assign(document.createElement("style"), {
            innerHTML: CSS_Match,
          }),
          Object.assign(document.createElement("div"), {
            innerHTML:
              (this.hasAttribute("buttons") ? `<chess-match-buttons></chess-match-buttons>` : ``) +
              (this.hasAttribute("playernames") ? `<div class="match_playernames"></div>` : ``) +
              `<div id="match_and_progress">` +
              `  <div>` +
              `    <chess-board record labels analysis></chess-board>` +
              `    <div id="TEST4CHECKBOARDS" style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 1em"></div>` +
              `  </div>` +
              `  <div>` +
              `    <chess-show-captured-pieces></chess-show-captured-pieces>` +
              `    <chess-game-progress></chess-game-progress>` +
              `  </div>` +
              `</div>` +
              `<div id="message"></div>`,
          })
        );
      }
      // ================================================== addListeners
      addListeners() {
        document.addEventListener("newGame", (evt) => this.createMatch(evt.detail));
        // handle game buttons
        this.addListeners = () => {}; // attach listeners only once
      }

      // ================================================== createMatch
      createMatch() {
        console.warn("createMatch");
        window.ROADSTECHNOLOGY.CHESS.id = new URLSearchParams(window.location.search).get("id") || this.getRandomID(1000);
        window.ROADSTECHNOLOGY.CHESS.displayname = new URLSearchParams(window.location.search).get("name") || prompt("Enter your Displayname", "Anonymous");
        localStorage.setItem("wp_user", window.ROADSTECHNOLOGY.CHESS.id);
        localStorage.setItem("player", window.ROADSTECHNOLOGY.CHESS.displayname);
        let { id, displayname } = window.ROADSTECHNOLOGY.CHESS;
        if (confirm("Do you want to start a new match as player white?")) {
          // -------------------------------------------------- callAPI
          window.CHESS.APIRT.callAPI({
            action: "CREATE",
            body: {
              wp_user_white: id, // user WordPress wp_user.id
              player_white: displayname, // user "name"
            },
            // -------------------------------------------------- callback
            callback: ({ rows }) => {
              // todo test for database failure, no rows
              let {
                tournament_id,
                wp_user_black,
                player_white, // for now a new match is always created by the white player
                wp_user_white,
                player_black,
                starttime,
                endtime,
                fen,
                result,
                match_guid, // matchGUID assigned by database
              } = rows[0];

              log("createMatch", match_guid);
              this.setPlayerTitles(player_white, player_black, wp_user_white, wp_user_black);
              this.initGame(match_guid);
            },
          });
        } else {
          // JOIN MATCH
          // Take wp_user_black and player_black:
          let wp_user_black = id;
          let player_black = displayname;
          // show availableGames (seats.html):
          location.assign(`seats.html?id=${wp_user_black}&name=${player_black}`);
        }
      }

      // ================================================== getRandomID()
      getRandomID(value) {
        return Math.floor(Math.random() * value);
      }

      // ================================================== setPlayerTitles()
      setPlayerTitles(p1, p2 = "<i>To Be Announced</i>", wp_user_white, wp_user_black) {
        const match_playernames = this.querySelector(".match_playernames");
        function preventEmptyName(name) {
          if (!name || name == "") return "<i>onbekend</i>";
          return name;
        }
        if (match_playernames) {
          match_playernames.innerHTML = `Match ${preventEmptyName(p1)} (${wp_user_white}) vs ${preventEmptyName(p2)} (${wp_user_black})`;
        }
      }
      // ================================================== isSamePlayer
      isSamePlayer(p1, p2) {
        return Number(p1) == Number(p2);
      }
      // ================================================== assignPlayerByMatchesRow
      assignPlayerByMatchesRow(matchesRow) {
        // todo : Check again whether this function does what it is supposed to do.
        // -------------------------------------------------- fancy console.log
        function consoleLog(playerColor) {
          let backgroundColor = playerColor === "WHITE" ? "background:white;color:black" : "background:black;color:white";
          console.groupCollapsed(`%c resumeMatch %c player: ${playerColor} `, "background:lightgreen", backgroundColor, fen);
          log(matchesRow);
          console.groupEnd();
        }
        // -------------------------------------------------- init variables
        let {
          // tournament_id, -- Can be added at a later time
          wp_user_white,    // WordPress wp_user.id
          wp_user_black,    // WordPress wp_user.id
          player_white,
          player_black,
          // starttime,     -- Can be added at a later time
          // endtime,       -- Can be added at a later time
          fen,              // FEN string from database table Matches
          // result,        -- Can be added at a later time
          // match_guid,    -- Can be added at a later time
        } = matchesRow;
        // -------------------------------------------------- determine current player
        window.ROADSTECHNOLOGY.CHESS.id = new URLSearchParams(document.location.search).get("id") || window.ROADSTECHNOLOGY.CHESS.id || localStorage.getItem("wp_user");
        window.ROADSTECHNOLOGY.CHESS.displayname = new URLSearchParams(document.location.search).get("name") || window.ROADSTECHNOLOGY.CHESS.displayname || localStorage.getItem("player");

        console.error(window.ROADSTECHNOLOGY.CHESS);

        let { id, displayname } = window.ROADSTECHNOLOGY.CHESS;

        // let playerName = prompt(`Match: ${player_white} VS ${player_black} Enter your previous display name`);

        console.log("assignPlayerByMatchesRow");
        if (window.ROADSTECHNOLOGY.CHESS.displayname == player_white) {
          consoleLog("WHITE");
          this.chessboard.player = window.CHESS.__PLAYER_WHITE__;
          console.warn(this.chessboard, this.chessboard.player);
          // this.updateProgressFromDatabase({ match_guid });
          this.updatePlayers({
            ...matchesRow, // all of matchesRow
            wp_user_white: id, // overwrite wp_user_white with WordPress_id
            player_white: displayname, // overwrite player_white with WordPress_displayname
          });
        } else {
          consoleLog("BLACK");
          this.chessboard.player = window.CHESS.__PLAYER_BLACK__;
          // this.updateProgressFromDatabase({ match_guid });
          this.updatePlayers({
            ...matchesRow, // all of matchesRow
            wp_user_black: id, // overwrite wp_user_black with WordPress_id
            player_black: displayname, // overwrite player_black with WordPress_displayname
          });
        }
        // -------------------------------------------------- init <chess-board>
        this.setPlayerTitles(player_white, player_black, wp_user_white, wp_user_black);
        this.chessboard.setPlayerAndFEN(this.chessboard.player, fen); // set attribute on <chess-board> set pieces on <chess-board>
      }

      // ================================================== resumeMatch
      // Gets match_guid, FEN, players and their name & (color)
      resumeMatch(match_guid) {
        console.warn("resumeMatch", match_guid);
        this.chessboard.resume(match_guid);
        // -------------------------------------------------- callAPI
        window.CHESS.APIRT.callAPI({
          action: "READ",
          body: { id: match_guid },
          // -------------------------------------------------- callback
          callback: ({ rows }) => {
            if (rows.length) {
              this.assignPlayerByMatchesRow(rows[0]);
            } else {
              localStorage.removeItem(window.CHESS.__MATCH_GUID__);
              this.createMatch();
            }
          },
        });
      }
      // ================================================== startMatch_send_startgame_to_database
      startMatch_send_startgame_to_database(id = localStorage.getItem(window.CHESS.__MATCH_GUID__)) {
        // ask database if there are matchmoves entries
        // only if there are no matchmoves entries, then start game
        window.CHESS.APIRT.callAPI({
          action: "MOVES", // vraag moves van deze match_guid
          body: { id },
          callback: ({ rows }) => {
            let noMovesYet = rows.length == 0;
            if (noMovesYet) {
              // player BLACK tells player WHITE to start the game:
              this.storeMove({ move: "startgame" });
            } else {
              this.updateProgressFromDatabase({ rows });
            }
          },
        });
      }
      // ================================================== updateProgressFromDatabase
      updateProgressFromDatabase({
        rows = false, // if false then call database again with match_guid
        match_guid = localStorage.getItem(window.CHESS.__MATCH_GUID__),
      }) {
        let chessboard = this.chessboard;
        function processRows(rows) {
          console.warn("Update progress from ", rows.length, "database rows");
          rows.forEach((row) => {
            let { 
              matchmoves_id, 
              match_guid, 
              fromsquare, 
              tosquare, 
              move, 
              fen, 
              tournament_id 
            } = row;
            if (move != "startgame" && move != "undomove" && window.CHESS.ChessBaseElement.evtCounter == 1) {
              chessboard.addChessMove({
                chessPiece: chessboard.getPiece(tosquare), // database does not know which piece it is
                //! NOTE: database fieldnames are lowercase, <chess-board> parameter camelCase
                fromSquare: fromsquare,
                toSquare: tosquare,
                fen,
                move,
              });
              console.warn("processRows from&to Square:", fromsquare, tosquare);
            }
          });
          chessboard.showLastMoveOnBoard();
        }

        if (rows) processRows(rows);
        else
          window.CHESS.APIRT.callAPI({
            action: "MOVES",
            body: { id: match_guid },
            callback: ({ rows }) => processRows(rows),
          });
      }
      // ================================================== updatePlayers
      updatePlayers({
        match_guid, // matchesRow
        wp_user_white,
        wp_user_black,
        player_white,
        player_black,
      }) {
        window.CHESS.APIRT.callAPI({
          action: "UPDATE",
          body: {
            match_guid, // GUID
            wp_user_white,
            wp_user_black,
            player_white,
            player_black,
          },
          callback: ({ rows }) => {
            let { player_white, player_black, wp_user_white, wp_user_black } = rows[0];
            this.setPlayerTitles(player_white, player_black, wp_user_white, wp_user_black);
            this.startMatch_send_startgame_to_database(); // let other player know that we are ready
          },
        });
      }

      // ================================================== storeMove
      storeMove({
        chessboard = this.chessboard, //
        move = "e2-e4",
        fen = chessboard.fen,
      }) {
        console.log("MAGIC FUNCTIONS:", new Error().stack);
        log("storeMove", move, fen);
        // chessboard.updateFENonScreen();
        // -------------------------------------------------- callAPI
        window.CHESS.APIRT.callAPI({
          action: "CHESSMOVE",
          body: {
            id: chessboard.id, // GUID
            move,
            fen,
          },
          // -------------------------------------------------- callback
          callback: ({ rows }) => {
            log("move saved", rows);
          },
        });
      }

      // ================================================== initGame
      initGame(match_guid) {
        log("initGame", match_guid);
        this.chessboard.id = match_guid;
        this.chessboard.fen = undefined; // set start FEN
        localStorage.setItem(window.CHESS.__MATCH_GUID__, match_guid);
      }
      // ================================================== myFEN
      myFEN() {
        this.chessboard.fen = "r3kbnr/ppp2ppp/2npbq2/4p3/4P3/2NPBQ2/PPP2PPP/R3KBNR w KQkq -";
      }
      // ================================================== removeMatch
      removeMatch() {
        localStorage.removeItem(window.CHESS.__MATCH_GUID__);
        location.reload();
      }
      // ================================================== undoMove
      undoMove() {
        log("UNDO MOVE"); //todo test
        this.chessboard.dispatchChessMove({ move: "undomove" });
        // -------------------------------------------------- dispatch undoMove
        this.dispatch({
          root: document,
          name: "undoMove",
          detail: {
            chessboard: this.chessboard,
            toSquare: this.chessboard.lastMove.toSquare,
          },
        });
      }
      // ================================================== remise
      remise() {
        if (confirm("Remise?")) {
          this.chessboard.setMessage("Game over. Gelijkspel.");
          this.chessboard.classList.add("game_over");
        }
      }
      // ================================================== fullscreen
      fullScreen() {
        var elem = this;

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          /* Safari */
          elem.webkitRequestFullscreen();
        }
      }
      // ================================================== forceBlackPlayer
      forceBlackPlayer() {
        this.updatePlayers({
          match_guid: this.chessboard.id,
          wp_user_white: window.ROADSTECHNOLOGY.CHESS.id,
          wp_user_black: this.getRandomID(),
          player_white: window.ROADSTECHNOLOGY.CHESS.displayname,
          player_black: "FORCED BLACK PLAYER",
        });
      }
    } //class
  ); //customElements.define("chess-match", class extends CHESS.ChessBaseElement
  // ********************************************************** end IIFE
})();
