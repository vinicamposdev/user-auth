// UtilHelper
export const isNullOrUndefined = (value: any) => {
  if (typeof value === 'undefined') {
    return true;
  }
  if (value === null) {
    return true;
  }
  return false;
};
export const safelyParseJSON = (json: string) => {
  // This function cannot be optimized, it's best to
  // keep it small!
  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    // Oh well, but whatever...
    parsed = undefined;
  }
  return parsed; // Could be undefined!
};
