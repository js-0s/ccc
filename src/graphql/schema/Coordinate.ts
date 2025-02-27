import { objectType, inputObjectType } from 'nexus';

export const CoordinateType = objectType({
  name: 'Coordinate',
  description:
    'Coordinates are a lnglat string (longitude and latitude separated by' +
    ' comma) that are used in the Location Object. These coordinates use' +
    ' longitude, latitude coordinate order (as opposed to latitude, longitude)' +
    ' to match the GeoJSON specification, which is equivalent to the' +
    ' OGC:CRS84 coordinate reference system.' +
    ' in addition latitude, longitude, altitude and accuracy may be specified' +
    ' and are converted appropriately.',
  definition(t) {
    t.date('createdAt', {
      description: 'Date and time when this coordinate was created.',
    });
    t.date('updatedAt', {
      description: 'Date and time when this coordinate was last updated.',
    });
    t.string('lnglat', {
      description: 'longitude and latitude separated by comma.',
    });
    t.float('longitude', {
      description: 'longitude of the coordinate.',
    });
    t.float('latitude', {
      description: 'latitude of the coordinate.',
    });
    t.float('altitude', {
      description: 'altitude of the coordinate.',
    });
    t.float('accuracy', {
      description: 'accuracy of the coordinate.',
    });
  },
});
export const CoordinateInputType = inputObjectType({
  name: 'CoordinateInput',
  description: 'Coordinate input parameter.',
  definition(t) {
    t.string('lnglat', {
      description: 'Longitude and latitude separated by comma.',
    });
    t.float('longitude', {
      description:
        'longitude of the coordinate. optional, takes precedence over lnglat',
    });
    t.float('latitude', {
      description:
        'latitude of the coordinate. optional, takes precedence over lnglat',
    });
    t.float('altitude', {
      description: 'altitude of the coordinate. optional',
    });
    t.float('accuracy', {
      description:
        'accuracy of the coordinate. optional. null means unknown,' +
        ' smaller numbers are more accurate. The radius of uncertainty for the location, measured in meters.',
    });
  },
});
