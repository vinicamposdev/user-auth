/** Patch operation.
 *
 * A Patch operation is a recipe to perform a task over an object.
 */
export interface IPatch {
  /** Operation to perform.
   *
   * Possible values are: add, replace, remove
   */
  op: string;

  /** The path to the attribute to patch */
  path: string;

  /** Optional value used for some operations (add & remove for example).
   */
  value?: any;
}
