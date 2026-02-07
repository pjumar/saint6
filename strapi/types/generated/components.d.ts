import type { Schema, Struct } from '@strapi/strapi';

export interface AboutFounder extends Struct.ComponentSchema {
  collectionName: 'components_about_founders';
  info: {
    description: 'Founder quote section';
    displayName: 'Founder';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutHighlightBand extends Struct.ComponentSchema {
  collectionName: 'components_about_highlight_bands';
  info: {
    description: 'Vision or mission highlight band';
    displayName: 'Highlight Band';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    statement: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface AboutIntro extends Struct.ComponentSchema {
  collectionName: 'components_about_intros';
  info: {
    description: 'About page intro section';
    displayName: 'About Intro';
  };
  attributes: {
    body_paragraph_1: Schema.Attribute.Text;
    body_paragraph_2: Schema.Attribute.Text;
    headline: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.DefaultTo<'ABOUT US'>;
  };
}

export interface AboutStory extends Struct.ComponentSchema {
  collectionName: 'components_about_stories';
  info: {
    description: 'Our story section';
    displayName: 'Our Story';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Our Story'>;
    paragraph_1: Schema.Attribute.Text;
    paragraph_2: Schema.Attribute.Text;
  };
}

export interface AboutTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_about_timeline_items';
  info: {
    description: 'A timeline entry with year, image and description';
    displayName: 'Timeline Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutValue extends Struct.ComponentSchema {
  collectionName: 'components_about_values';
  info: {
    description: 'A core value with letter, title and description';
    displayName: 'Value';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    letter: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_contact_infos';
  info: {
    description: 'Contact information section';
    displayName: 'Contact Info';
  };
  attributes: {
    address_line_1: Schema.Attribute.String;
    address_line_2: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
    subheading: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Contact Us'>;
  };
}

export interface HomepageCrewArea extends Struct.ComponentSchema {
  collectionName: 'components_homepage_crew_areas';
  info: {
    description: 'Crew area section with dining and makeup room images';
    displayName: 'Crew Area';
  };
  attributes: {
    caption: Schema.Attribute.String & Schema.Attribute.DefaultTo<'CREW AREA'>;
    heading: Schema.Attribute.Text & Schema.Attribute.Required;
    info_label: Schema.Attribute.String & Schema.Attribute.DefaultTo<'INFO'>;
    info_text: Schema.Attribute.Text;
    main_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    secondary_image_1: Schema.Attribute.Media<'images'>;
    secondary_image_2: Schema.Attribute.Media<'images'>;
  };
}

export interface HomepageSpaceSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_space_sections';
  info: {
    description: 'Wide range of space section with stats and gallery';
    displayName: 'Space Section';
  };
  attributes: {
    caption: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'WIDE RANGE OF SPACE'>;
    cta_link: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/studio-rental'>;
    cta_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'VIEW STUDIO RENTAL'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    gallery_images: Schema.Attribute.Media<'images', true>;
    stats: Schema.Attribute.Component<'shared.stat', true>;
  };
}

export interface PortfolioSettings extends Struct.ComponentSchema {
  collectionName: 'components_portfolio_settings';
  info: {
    description: 'Portfolio section header settings';
    displayName: 'Portfolio Settings';
  };
  attributes: {
    label: Schema.Attribute.String;
    statement: Schema.Attribute.Text;
  };
}

export interface ProjectProjectImage extends Struct.ComponentSchema {
  collectionName: 'components_project_project_images';
  info: {
    description: 'Gallery image for a project';
    displayName: 'Project Image';
  };
  attributes: {
    alt: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ProjectTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_project_team_members';
  info: {
    description: 'Project team member with role and name';
    displayName: 'Team Member';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProjectTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_project_testimonials';
  info: {
    description: 'Client testimonial with quote and author';
    displayName: 'Testimonial';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedClientsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_clients_sections';
  info: {
    description: 'Section showing client logos with label and description';
    displayName: 'Clients Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String;
  };
}

export interface SharedGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_images';
  info: {
    description: 'Image with optional title and description';
    displayName: 'Gallery Image';
  };
  attributes: {
    alt: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: 'Hero section with heading and background image';
    displayName: 'Hero';
  };
  attributes: {
    background_alt: Schema.Attribute.String;
    background_image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    heading: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedIntro extends Struct.ComponentSchema {
  collectionName: 'components_shared_intros';
  info: {
    description: 'Section intro with title, description and CTA';
    displayName: 'Intro';
  };
  attributes: {
    cta_link: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String;
  };
}

export interface SharedService extends Struct.ComponentSchema {
  collectionName: 'components_shared_services';
  info: {
    description: 'Unified service/workflow item with optional counter';
    displayName: 'Service';
  };
  attributes: {
    counter: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    description: 'A statistic with label and value';
    displayName: 'Stat';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StudioFacilities extends Struct.ComponentSchema {
  collectionName: 'components_studio_facilities';
  info: {
    description: 'Makeup and dining facilities showcase';
    displayName: 'Facilities';
  };
  attributes: {
    lounge_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    makeup_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface StudioFullRental extends Struct.ComponentSchema {
  collectionName: 'components_studio_full_rentals';
  info: {
    description: 'Full studio rental card';
    displayName: 'Full Rental';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    price: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StudioStats extends Struct.ComponentSchema {
  collectionName: 'components_studio_stats';
  info: {
    description: 'Studio statistics overview';
    displayName: 'Studio Stats';
  };
  attributes: {
    blank_rooms: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    ceiling_height: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'4.5m'>;
    concept_rooms: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    total_rooms: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<6>;
    total_space: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'900m\u00B2'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.founder': AboutFounder;
      'about.highlight-band': AboutHighlightBand;
      'about.intro': AboutIntro;
      'about.story': AboutStory;
      'about.timeline-item': AboutTimelineItem;
      'about.value': AboutValue;
      'contact.info': ContactInfo;
      'homepage.crew-area': HomepageCrewArea;
      'homepage.space-section': HomepageSpaceSection;
      'portfolio.settings': PortfolioSettings;
      'project.project-image': ProjectProjectImage;
      'project.team-member': ProjectTeamMember;
      'project.testimonial': ProjectTestimonial;
      'shared.clients-section': SharedClientsSection;
      'shared.gallery-image': SharedGalleryImage;
      'shared.hero': SharedHero;
      'shared.intro': SharedIntro;
      'shared.service': SharedService;
      'shared.stat': SharedStat;
      'studio.facilities': StudioFacilities;
      'studio.full-rental': StudioFullRental;
      'studio.stats': StudioStats;
    }
  }
}
