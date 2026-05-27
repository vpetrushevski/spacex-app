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
    public docs: LaunchObject[] = [],
    public totalDocs: number = 0,
    public limit: number = 0,
    public totalPages: number = 0,
    public page: number = 0,
    public pagingCounter: number = 0,
    public hasPrevPage: boolean = false,
    public hasNextPage: boolean = false,
    public prevPage: number | null = null,
    public nextPage: number | null = null
  ) {}
}

export class LaunchObject {
  constructor(
    public fairings: FairingsObject = new FairingsObject(),
    public links: LaunchLinksObject = new LaunchLinksObject(),

    public staticFireDateUtc: string = '',
    public staticFireDateUnix: number = 0,

    public net: boolean = false,
    public window: number = 0,

    public rocket: string = '',
    public success: boolean | null = null,

    public failures: LaunchFailureObject[] = [],

    public details: string = '',

    public crew: LaunchCrewObject[] = [],

    public ships: string[] = [],
    public capsules: string[] = [],
    public payloads: string[] = [],

    public launchpad: string = '',

    public flightNumber: number = 0,
    public name: string = '',

    public dateUtc: string = '',
    public dateUnix: number = 0,
    public dateLocal: string = '',
    public datePrecision: string = '',

    public upcoming: boolean = false,

    public cores: LaunchCoreObject[] = [],

    public autoUpdate: boolean = false,
    public tbd: boolean = false,

    public LaunchLibraryId: string = '',

    public id: string = ''
  ) {}
}

export class FairingsObject {
  constructor(
    public reused: boolean = false,
    public recoveryAttempt: boolean = false,
    public recovered: boolean = false,
    public ships: string[] = []
  ) {}
}

export class LaunchLinksObject {
  constructor(
    public patch: LaunchPatchObject = new LaunchPatchObject(),
    public reddit: LaunchRedditObject = new LaunchRedditObject(),
    public flickr: LaunchFlickrObject = new LaunchFlickrObject(),

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

export class LaunchRedditObject {
  constructor(
    public campaign: string = '',
    public Launch: string = '',
    public media: string = '',
    public recovery: string = ''
  ) {}
}

export class LaunchFlickrObject {
  constructor(
    public small: string[] = [],
    public original: string[] = []
  ) {}
}

export class LaunchFailureObject {
  constructor(
    public time: number = 0,
    public altitude: number = 0,
    public reason: string = ''
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
    public coreId: string = '',
    public flight: number = 0,

    public gridfins: boolean = false,
    public legs: boolean = false,
    public reused: boolean = false,

    public landingAttempt: boolean = false,
    public landingSuccess: boolean = false,

    public landingType: string = '',
    public landpad: string = ''
  ) {}
}

export class RocketObject {
  constructor(
    public height: RocketDimensionObject = new RocketDimensionObject(),
    public diameter: RocketDimensionObject = new RocketDimensionObject(),
    public mass: RocketMassObject = new RocketMassObject(),
    public flickrImages: string[] = [],
    public name: string = '',
    public type: string = '',
    public active: boolean = false,
    public stages: number = 0,
    public boosters: number = 0,
    public costPerLaunch: number = 0,
    public successRatePct: number = 0,
    public firstFlight: string = '',
    public country: string = '',
    public company: string = '',
    public wikipedia: string = '',
    public description: string = '',
    public id: string = ''
  ) {}
}

export class RocketDimensionObject {
  constructor(
    public meters: number | null = null,
    public feet: number | null = null
  ) {}
}

export class RocketMassObject {
  constructor(
    public kg: number = 0,
    public lb: number = 0
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
    public latitude: number = 0,
    public longitude: number = 0,
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
    latitude: number = 0,
    longitude: number = 0,
    details: string = '',
    id: string = '',
    public launchAttempts: number = 0,
    public launchSuccesses: number = 0,
    public rockets: string[] = [],
    public timezone: string = ''
  ) {
    super(images, name, fullName, status, locality, region, latitude, longitude, details, id);
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
    latitude: number = 0,
    longitude: number = 0,
    details: string = '',
    id: string = '',
    public type: string = '',
    public landingAttempts: number = 0,
    public landingSuccesses: number = 0,
    public wikipedia: string = ''
  ) {
    super(images, name, fullName, status, locality, region, latitude, longitude, details, id);
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
    public legacyId: string = '',
    public model: string = '',
    public type: string = '',
    public roles: string[] = [],
    public yearBuilt: number | null = null,
    public homePort: string = '',
    public status: string = '',
    public latitude: number | null = null,
    public longitude: number | null = null,
    public link: string = '',
    public image: string = '',
    public name: string = '',
    public active: boolean = false,
    public id: string = ''
  ) {}
}
