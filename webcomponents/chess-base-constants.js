// ********************************************************** Generic Helper Functions

window.CHESS = Object.assign(
  {},
  {
    // ********************************************************** HTML CSS
    // TODO: create as attribute and property on <chess-board> so user can select theme colors
    __CLASSNAME_WHITESQUARE__: "white_square",
    __CLASSNAME_BLACKSQUARE__: "black_square",

    // ********************************************************** Web Component Strings
    __WC_CHESS_PIECE__: "chess-piece",
    __WC_CHESS_SQUARE__: "chess-square",
    __WC_CHESS_BOARD__: "chess-board",
    // Web Component attributes
    __WC_ATTRIBUTE_AT__: "at", // <chess-square at="a8" piece="wit-koning">
    __WC_ATTRIBUTE_PIECENAME__: "piece", // <chess-square piece="wit-koning">
    __WC_ATTRIBUTE_IS__: "is", // <chess-piece is="wit-koning">
    __WC_ATTRIBUTE_FEN__: "fen", // FEN notation
    __WC_ATTRIBUTE_RECORD__: "record", // <chess-board record> triggers saving moves to database
    __WC_ATTRIBUTE_PLAYER__: "player", // <chess-board player=" __PLAYER_WHITE__ / __PLAYER_BLACK__ ">
    __WC_ATTRIBUTE_PLAYERTURN__: "playerturn", // <chess-board playerturn=" __PLAYER_WHITE__ / __PLAYER_BLACK__ ">
    __WC_ATTRIBUTE_ATTACKEDBY__: "attackedby", // <chess-square attackedby="Ne3,Qe8">
    __WC_ATTRIBUTE_DEFENDEDBY__: "defendedby", // <chess-square defendedby="Ne3,Qe8">
    __WC_ATTRIBUTE_MOVESFROM__: "movesfrom", // <chess-square movesfrom="Pg2, qh4">

    // ********************************************************** Eventname constants in all chess files
    __STORECHESSMOVE__: "STORECHESSMOVE", // send to <chess-match>

    // ********************************************************** Chess Game constants
    // chess constants
    __FILES__: "abcdefgh".split(""),
    __RANKS__: "12345678".split(""),
    __SQUARE_TOP_LEFT__: "a8",
    __SQUARE_TOP_RIGHT__: "h8",
    __SQUARE_BOTTOM_LEFT__: "a1",
    __SQUARE_BOTTOM_RIGHT__: "h1",
    __SQUARE_WHITE_KING_START__: "e1",
    __SQUARE_BLACK_KING_START__: "e8",

    __PROTECT_PIECE__: "p", // used to highlight the moves a chesspiece can make
    __ATTACK_PIECE__: "x", // used to highlight the moves a chesspiece can make
    __EMPTY_SQUARE__: "e", // used to highlight the moves a chesspiece can make

    __MOVETYPE_MOVE__: "-", // used in move notation
    __MOVETYPE_CAPTURE__: "x", // used in move notation
    __MOVETYPE_ILLEGAL__: "X", // used in move notation

    __PLAYER_WHITE__: "wit", // used as player color AND chesspiece names
    __PLAYER_BLACK__: "zwart", // used as player color AND chesspiece names
    __PIECE_SEPARATOR__: "-", //
    __PIECE_KING__: "koning", // piecenames used as chesspiece filenames
    __PIECE_PAWN__: "pion",
    __PIECE_ROOK__: "toren",
    __PIECE_QUEEN__: "koningin",
    __PIECE_KNIGHT__: "paard",
    __PIECE_BISHOP__: "loper",

    __TESTBOARD_FOR_MOVES__: "testboard",
    __PLAYER_COLOR__: "playercolor",
    __MATCH_GUID__: "match_guid",

    __MOVEPIECE_ANIMATION_DURATION__: 500,
    // ********************************************************** FEN
    __FEN_WHITE_KING__: "K",
    __FEN_BLACK_KING__: "k",
    __FEN_WHITE_TOWER__: "R",
    __FEN_BLACK_TOWER__: "r",
    __FEN_WHITE_QUEEN__: "Q",
    __FEN_BLACK_QUEEN__: "q",

    // ********************************************************** translate moves for all pieces */
    __HORSEMOVES__: [[[2, 1]], [[2, -1]], [[-2, 1]], [[-2, -1]], [[1, 2]], [[1, -2]], [[-1, 2]], [[-1, -2]]],
    __BISHOPMOVES__: [
      [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
      ],
      [
        [-1, -1],
        [-2, -2],
        [-3, -3],
        [-4, -4],
        [-5, -5],
        [-6, -6],
        [-7, -7],
      ],
      [
        [-1, 1],
        [-2, 2],
        [-3, 3],
        [-4, 4],
        [-5, 5],
        [-6, 6],
        [-7, 7],
      ],
      [
        [1, -1],
        [2, -2],
        [3, -3],
        [4, -4],
        [5, -5],
        [6, -6],
        [7, -7],
      ],
    ],
    __ROOKMOVES__: [
      [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
        [0, 7],
      ],
      [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
      ],
      [
        [0, -1],
        [0, -2],
        [0, -3],
        [0, -4],
        [0, -5],
        [0, -6],
        [0, -7],
      ],
      [
        [-1, 0],
        [-2, 0],
        [-3, 0],
        [-4, 0],
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
    ],
    __KINGMOVES__: [[[0, 1]], [[1, 1]], [[1, 0]], [[1, -1]], [[0, -1]], [[-1, -1]], [[-1, 0]], [[-1, 1]]],
  }
);
Object.assign(CHESS, {
  __PIECE_WHITE_PAWN__: CHESS.__PLAYER_WHITE__ + CHESS.__PIECE_SEPARATOR__ + CHESS.__PIECE_PAWN__,
  __PIECE_BLACK_PAWN__: CHESS.__PLAYER_BLACK__ + CHESS.__PIECE_SEPARATOR__ + CHESS.__PIECE_PAWN__,

  __PLAYER_COLORS__: [CHESS.__PLAYER_WHITE__, CHESS.__PLAYER_BLACK__],
  __PIECE_NAMES__: [CHESS.__PIECE_ROOK__, CHESS.__PIECE_KNIGHT__, CHESS.__PIECE_BISHOP__, CHESS.__PIECE_QUEEN__, CHESS.__PIECE_KING__, CHESS.__PIECE_PAWN__],
  __QUEENMOVES__: [...CHESS.__BISHOPMOVES__, ...CHESS.__ROOKMOVES__],
});

// ********************************************************** Helper functions
Object.assign(CHESS, {
  otherPlayer: (color) => (color == CHESS.__PLAYER_WHITE__ ? CHESS.__PLAYER_BLACK__ : CHESS.__PLAYER_WHITE__),

  // ======================================================== CHESS.createBoardElement
  createBoardElement: ({ tag = CHESS.__WC_CHESS_BOARD__, props = {}, attrs = [] }) => {
    console.warn("TAG:", tag, "PROPS:", props);
    const chessboard = document.createElement(tag);
    chessboard.id = props.id;
    console.warn("SET PROPS FEN:", props.fen);
    setTimeout(() => {
      chessboard.fen = props.fen;
    }, 10);
    attrs.map(([name, value]) => chessboard.setAttribute(name, value));
    return chessboard;
  },
});

// ********************************************************** CHESS Analysis constants
Object.assign(CHESS, {
  __ANALYSIS_PRE__: "pre_analysis",
  __ANALYSIS_MAIN__: "main_analysis",
});

// ********************************************************** Square functions
const translateSquare = (square, file_offset, rank_offset) => {
  // TODO: ("b2", 1, 1) -> "c3"
  // TODO: ("b2", -1, -1) -> "a1"
};

// create a lookup Map ONCE to lookup BOTH letters OR piecename
// "R" -> "wit-toren"
// "wit-toren" -> "R"
let FENMap = new Map(); // see MDN Map documentation
let FENletters = "RNBQKPrnbqkp".split(""); // create an array of letters
CHESS.__PLAYER_COLORS__.forEach((color) =>
  CHESS.__PIECE_NAMES__.forEach((name) => {
    let piece = color + CHESS.__PIECE_SEPARATOR__ + name;
    let letter = FENletters.shift(); // remove first letter from array
    FENMap.set(piece, letter);
    FENMap.set(letter, piece);
  })
);
Object.assign(CHESS, {
  convertFEN: (name) => FENMap.get(name), // return R or wit-toren
});

// ********************************************************** Chess BaseElement for <chess-board>,<chess-square>,<chess-piece>
