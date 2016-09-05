import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../src/store/reducer';

describe('reducer', () => {

  it('has an initial state', () => {
    const action = {
      type: 'SET_CURRENT_SHOWS',
      shows: [
        {name: 'Friends'},
        {name: 'Will & Grace'}
      ]
    };
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      currentShows: [
        {name: 'Friends'},
        {name: 'Will & Grace'}
      ]
    }));
  });

  it('handles SET_CURRENT_SHOWS', () => {
    const initialState = Map({
      currentShows: List()
    });
    const action = {
      type: 'SET_CURRENT_SHOWS',
      shows: [
        {name: 'Friends'},
        {name: 'Will & Grace'}
      ]
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      currentShows: [
        {name: 'Friends'},
        {name: 'Will & Grace'}
      ]
    }));
  });

  it('handles ADD_SHOW', () => {
    const initialState = fromJS({
      currentShows: [
        {name: 'Friends'},
        {name: 'Will & Grace'}
      ]
    });
    const action = {
      type: 'ADD_SHOW',
      show: {name: 'Suits'}
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      currentShows: [
        {name: 'Friends'},
        {name: 'Will & Grace'},
        {name: 'Suits'}
      ]
    }));
  });

  it('handles REMOVE_SHOW', () => {
    const initialState = fromJS({
      currentShows: [
        {_id: 1, name: 'Friends'},
        {_id: 2, name: 'Will & Grace'},
        {_id: 3, name: 'Suits'}
      ]
    });
    const action = {
      type: 'REMOVE_SHOW',
      id: 3
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      currentShows: [
        {_id: 1, name: 'Friends'},
        {_id: 2, name: 'Will & Grace'}
      ]
    }));
  });

  it('handles TOGGLE_WATCHED', () => {
    const initialState = fromJS({
      currentShows: [
        {name: 'Friends', episodes: [{ id: 1, watched: false }]},
        {name: 'Will & Grace', episodes: [{ id: 1, watched: false }]},
        {name: 'Suits', episodes: [{ id: 1, watched: false }]}
      ]
    });
    const action = {
      type: 'TOGGLE_WATCHED',
      show: {name: 'Suits'},
      episodeId: 1
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      currentShows: [
        {name: 'Friends', episodes: [{ id: 1, watched: false }]},
        {name: 'Will & Grace', episodes: [{ id: 1, watched: false }]},
        {name: 'Suits', episodes: [{ id: 1, watched: true }]}
      ]
    }));
  });

});