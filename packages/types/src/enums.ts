export enum Direction {
  N = 0,
  NE = 1,
  E = 2,
  SE = 3,
  S = 4,
  SW = 5,
  W = 6,
  NW = 7
}

export enum ModifierOp {
  ADD = 'ADD',
  SUB = 'SUB',
  MUL = 'MUL'
}

export enum EvalStatus {
  NONE = 0,
  PENDING = 1,
  DONE = 2
}

export enum EvalTarget {
  REF = 'R',
  QUEST = 'Q',
  TARGET = 'T',
  SUBJECT = 'S',
  LINKED_REF = 'L',
  COMBAT_TARGET = 'C'
}

export enum AudioStatus {
  NONE = 0,
  LOADING = 1,
  PLAYING = 3,
  LOADED = 2,
  PAUSED = 4,
  STOPPED = 6,
  FAILED = 7,
  DONE = 8
}

// prettier-ignore
export enum Wall {
	NONE        = 0b0000,
	WALL_N      = 0b0001,
	WALL_S      = 0b0010,
	WALL_NS     = 0b0011,
	WALL_W      = 0b0100,
	WALL_NW     = 0b0101,
	WALL_SW     = 0b0110,
	WALL_NSW    = 0b0111,
	WALL_E      = 0b1000,
	WALL_NE     = 0b1001,
	WALL_SE     = 0b1010,
	WALL_NSE    = 0b1011,
	WALL_EW     = 0b1100,
	WALL_EWS    = 0b1101,
	WALL_EWN    = 0b1110,
	WALL_NSEW   = 0b1111,
}

// 00: no collision
// 10: obstruction only
// 01: obstacle only
// 11: obstacle + obstruction

export enum Block {
  NONE = 0b00,
  OBSTRUCTION = 0b10,
  OBSTACLE = 0b01,
  COMPLETE = 0b11
}

export enum Projection {
  ORTHOGRAPHIC = 0,
  ISOMETRIC = 1
}

export enum AOE {
  LINE = 0,
  SEMICIRCLE = 1,
  CIRCLE = 2,
  CONE = 3,
  CROSS = 4
}
