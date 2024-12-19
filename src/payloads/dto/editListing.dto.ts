import CreateListingDTO from "./createListing.dto";

export interface EditListingDto extends CreateListingDTO {
    property_id: string;

}