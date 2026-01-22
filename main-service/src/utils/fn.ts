export class Fn {
  //   static randomString(length: number): string {
  //     let result = '';
  //     const characters =
  //       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //     const charactersLength = characters.length;
  //     for (let i = 0; i < length; i++) {
  //       result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //     }
  //     return result;
  //   }

  static changeNameToSlug(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  //   static deg2rad(deg: number) {
  //     return deg * (Math.PI / 180);
  //   }

  //   static getDistanceInKm(
  //     lat1: number,
  //     lon1: number,
  //     lat2: number,
  //     lon2: number,
  //   ) {
  //     const R = 6371; // Radius of the earth in km
  //     const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
  //     const dLon = this.deg2rad(lon2 - lon1);
  //     const a =
  //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //       Math.cos(this.deg2rad(lat1)) *
  //         Math.cos(this.deg2rad(lat2)) *
  //         Math.sin(dLon / 2) *
  //         Math.sin(dLon / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //     const d = R * c; // Distance in km
  //     return d;
  //   }

  //   static removeUndefinedKeys<T extends Record<string, any>>(
  //     obj: T,
  //   ): Partial<T> {
  //     return Object.fromEntries(
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       Object.entries(obj).filter(([_, value]) => value !== undefined),
  //     ) as Partial<T>;
  //   }
}
