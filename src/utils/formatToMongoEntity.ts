import { _id } from "@next-auth/mongodb-adapter";

export const format = {
  /** Takes a mongoDB object and returns a plain old JavaScript object */
  from(object: any) {
    const newObject: any = {};
    for (const key in object) {
      const value = object[key];
      if (key === "_id") {
        newObject.id = value.toHexString();
      } else if (key === "userId") {
        newObject[key] = value.toHexString();
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },

  /** Takes a plain old JavaScript object and turns it into a mongoDB object */
  to(object: any) {
    const newObject: any = {
      _id: _id(object.id),
    };
    for (const key in object) {
      const value = object[key];
      if (key === "userId") {
        newObject[key] = _id(value);
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },
};
