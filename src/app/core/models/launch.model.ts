import { SortDirection } from "../enums/sort-direction.enum";

export class GetLaunchesRequestObject {
  constructor(
    public upcoming: boolean | null = null,
    public page: number = 1,
    public limit: number = 10,
    public sortDirection: SortDirection = SortDirection.Desc
  ) {}
}

export class PaginatedLaunchesResponseObject {
  constructor(
    public launches: LaunchObject[] = [],
    public totalDocs: number = 0,
    public limit: number = 0,
    public totalPages: number = 0,
    public page: number = 0
  ) {}
}

export class LaunchObject {
  constructor(
    public links: LaunchLinksObject = new LaunchLinksObject(),
    public rocket: string = '',
    public success: boolean | null = null,
    public details: string = '',
    public crew: LaunchCrewObject[] = [],
    public ships: string[] = [],
    public capsules: string[] = [],
    public launchpad: string = '',
    public flightNumber: number = 0,
    public name: string = '',
    public dateUtc: string = '',
    public upcoming: boolean = false,
    public cores: LaunchCoreObject[] = [],
    public id: string = ''
  ) {}
}

export class LaunchLinksObject {
  constructor(
    public patch: LaunchPatchObject = new LaunchPatchObject(),
    public presskit: string = '',
    public webcast: string = '',
    public youtubeId: string = '',
    public article: string = '',
    public wikipedia: string = ''
  ) {}
}

export class LaunchPatchObject {
  constructor(
    public small: string = '',
    public large: string = ''
  ) {}
}

export class LaunchCrewObject {
  constructor(
    public crewId: string = '',
    public role: string = ''
  ) {}
}

export class LaunchCoreObject {
  constructor(
    public landingType: string = '',
    public landpad: string = ''
  ) {}
}

export class RocketObject {
  constructor(
    public flickrImages: string[] = [],
    public name: string = '',
    public type: string = '',
    public costPerLaunch: number = 0,
    public successRatePct: number = 0,
    public description: string = '',
    public id: string = ''
  ) {}
}

export abstract class BasePadObject {
  constructor(
    public images: PadImagesObject = new PadImagesObject(),
    public name: string = '',
    public fullName: string = '',
    public status: string = '',
    public locality: string = '',
    public region: string = '',
    public details: string = '',
    public id: string = ''
  ) {}
}

export class PadImagesObject {
  constructor(
    public large: string[] = []
  ) {}
}

export class LaunchpadObject extends BasePadObject {
  constructor(
    images: PadImagesObject = new PadImagesObject(),
    name: string = '',
    fullName: string = '',
    status: string = '',
    locality: string = '',
    region: string = '',
    details: string = '',
    id: string = ''
  ) {
    super(images, name, fullName, status, locality, region, details, id);
  }
}

export class LandpadObject extends BasePadObject {
  constructor(
    images: PadImagesObject = new PadImagesObject(),
    name: string = '',
    fullName: string = '',
    status: string = '',
    locality: string = '',
    region: string = '',
    details: string = '',
    id: string = '',
    public type: string = ''
  ) {
    super(images, name, fullName, status, locality, region, details, id);
  }
}

export class CrewMemberObject {
  constructor(
    public name: string = '',
    public agency: string = '',
    public image: string = '',
    public wikipedia: string = '',
    public status: string = '',
    public id: string = ''
  ) {}
}

export class CapsuleObject {
  constructor(
    public reuseCount: number = 0,
    public waterLandings: number = 0,
    public landLandings: number = 0,
    public lastUpdate: string = '',
    public serial: string = '',
    public status: string = '',
    public type: string = '',
    public id: string = ''
  ) {}
}

export class ShipObject {
  constructor(
    public type: string = '',
    public roles: string[] = [],
    public homePort: string = '',
    public image: string = '',
    public name: string = '',
    public active: boolean = false,
    public id: string = ''
  ) {}
}
