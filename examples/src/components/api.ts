export const theApi = async (base: number) => {
  await new Promise((r) => setTimeout(r, 1000));
  return 100 + base;
};
