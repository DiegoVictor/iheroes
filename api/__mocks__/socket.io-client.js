export const emit = jest.fn();

export const to = jest.fn(() => {
  return { emit };
});

export const connect = jest.fn();

export const on = jest.fn();

export default () => ({
  to,
  emit,
  on,
  connect,
});
