export const action = jest.fn();

const actions = {};

action.mockImplementation((name) => {
  if (actions[name] == null) {
    actions[name] = jest.fn();
  }

  return actions[name];
});
