<?php
/**
 * The functions for holding main functionality for the website.
 *
 * @package Hex Digital
 * @subpackage Skeleton Theme
 * @since 2016
 */

/**
 * Table of Contents
 *
 * 0.0 Global base code
 *     0.1 Autoload, Namespacing + Dependencies
 *     0.2 Hooks, Actions and Filters
 *     0.3 ACF export file
 *     0.4 Miscellaneous
 *
 * 1.0 Skeleton Theme Functions
 *     1.1 Environment Functions
 *     1.2 URI + Versioning Functions
 *     1.3 SVG Icon System
 *     1.4 Theme Setup
 *     1.5 Theme Functions
 */


/**
 * 0.0 Global base code
 */

/** 0.1 Autoload, Namespacing + Dependencies */


/** 0.2 Hooks, Actions and Filters */
add_action( 'wp_enqueue_scripts', 'theme_scripts' );

add_filter( 'allow_dev_auto_core_updates', '__return_true' );
add_filter( 'allow_minor_auto_core_updates', '__return_true' );
add_filter( 'auto_update_plugin', '__return_true' );
add_filter( 'auto_update_theme', '__return_true' );


/** 0.3 ACF migration code */
// SETUP INSTRUCTION: Uncomment if ACF is required - do ACF in acf/migations.php NOT in CMS
//$acf_export_file = __DIR__ . '/acf/export.php';
//if ( file_exists( $acf_export_file ) ) include $acf_export_file;


/** 0.4 Miscellaneous */
// This global var is used for revision queries, so the array of hashes is not redefined with each function call
$revision_hash = false;


/**
 * 1.0 Skeleton Theme
 */

/** 1.1 Environment Functions */

/**
 * Gets the environment from the APP_ENV variable. This variable can either be
 * set in the Apache httpd.conf file or the .htaccess file in the form of:
 *
 *     SetEnv APP_ENV production
 *
 * If no environment variable is defined, this function will always assume a
 * production environment.
 *
 * @return string The name of the current environment
 */
function get_environment() {
    return getenv( 'APP_ENV' ) ?: 'production';
}

/**
 * Returns true if the current environment is development, and false if not.
 *
 * @return boolean Whether we're in a development environment
 */
function is_development() {
    return ( 'development' === get_environment() );
}

/**
 * Returns true if the current environment is staging, and false if not.
 *
 * @return boolean Whether we're in a staging environment
 */
function is_staging() {
    return ( 'staging' === get_environment() );
}

/**
 * Returns true if the current environment is production, and false if not.
 * This method is best used in an if statement around production only scripts
 * such as Google Analytics or Google Tag Manager tracking code.
 *
 * @return boolean Whether we're in a production environment
 */
function is_production() {
    return ( 'production' === get_environment() );
}


/** 1.2 URI + Versioning Functions */

/**
 * Gets the current revision hash.
 *
 * The revision hash is only based on the current deployment (on production)
 * which is created by DeployBot. This can be used to clear caches using query
 * strings based on the deployment only. Please bear in mind, the usage of this
 * function should be carefully thought about since individual files should use
 * their specific hash, based on the modification date using `get_commit_hash()`.
 *
 * @return string The current revision hash
 */
function get_revision_hash() {
    global $revision_hash;
    $revision_path = get_template_directory() . '/.revision';
    if ( ! is_production() ) return '';
    if ( ! file_exists( $revision_path ) ) return '';
    if ( false === $revision_hash ) $revision_hash = file_get_contents( $revision_path, null, null, 0, 7 );
    return $revision_hash;
}

/**
 * Returns the revision hash for a particular file, from its meta data.
 *
 * This function is a last resort to add a version, if both the commit hash and
 * the revision hash from DeployBot are not present. This function takes the
 * modification date fom the file meta data, which will always change for every
 * file upon deployment, because deploying to containers requires an upload of
 * all assets from the repository. Only use as a last resort, and sparingly.
 */
function get_file_hash( $uri ) {
    $uri = get_template_directory() . $uri;
    return file_exists( $uri ) ? filemtime( $uri ) : '';
}

/**
 * Returns the revision hash for a particular file.
 *
 * The hash that's returned is based on the modification timestamp of the file,
 * entered via the $uri parameter. This timestamp comes from the Git repository,
 * not the file meta data. The reason for this is because deploying to
 * containers requires an upload of all assets from the repository so, that
 * modification date will be on that particular occasion (when the files are
 * uploaded to the container), which will be incorrect. If this file does not
 * exist, the function will return an empty string.
 *
 * @param  string $uri The URI of the asset (relative to the theme directory)
 * @return string      The file revision hash
 */
function get_commit_hash( $uri ) {
    $revision = '';
    $assets_path = get_template_directory() . '/assets.json';
    if ( file_exists( $assets_path ) ) {
        $assets = json_decode( file_get_contents( $assets_path ), true );
        if ( isset( $assets[$uri] ) ) $revision = substr( md5( $assets[$uri] ), 0, 7 );
    }
    return $revision;
}

/**
 * Returns the actual revision string for use as a query variable.
 *
 * @param  string $uri      The relative URI of the file (which is used to
 *                          display a hash specific for that file)
 * @param  string $revision The string of a desired custom revision (if not the
 *                          revision hash of the file itself)
 * @return string           The revision string which can be used as a query var
 */
function get_revision_string( $uri = '', $revision = '' ) {
    if ( $revision ) return $revision;

    if ( $uri ) {
        if ( $revision = get_commit_hash( $uri ) ) {
            return $revision;
        }
    }
    $revision = get_revision_hash();
    return $revision ?: get_file_hash( $uri );
}

/**
 * Returns the revision query that can be used directly after a URI.
 *
 * @param  string $uri      The relative URI of the file (which is used to
 *                          display a hash specific for that file)
 * @param  string $revision The string of a desired custom revision (if not the
 *                          revision hash of the file itself)
 * @return string           The revision query string which can be appended to
 *                          a URI
 */
function get_revision_query( $uri = '', $revision = '' ) {
    return '?v=' . get_revision_string( $uri, $revision );
}

/**
 * Gets the build URI for a particular file.
 *
 * @param  string $uri The URI of the file (relative to the theme)
 * @return string      The full build path of the URI entered (with query
 *                     strings prepended if necessary)
 */
function get_build_uri( $uri ) {
    return get_build_directory_uri() . $uri . get_revision_query( $uri );
}

/**
 * Returns the general build directory URI.
 *
 * This will usually be the relative `/build` directory from the theme but, if
 * we're in production and a CDN constant is defined in the `wp-config.php` file
 * such as:
 *
 *     define( 'WP_CDN', 'https://a1b2c3d4e5f6g7.cloudfront.net/build' );
 *
 * then this will be returned instead.
 *
 * @return string The build directory
 */
function get_build_directory_uri() {
   if ( 'production' === get_environment() && defined( 'WP_CDN' ) ) return WP_CDN;
   return get_template_directory_uri() . '/build';
}

/**
 * Returns the absolute directory for partials for the theme
 *
 * @return string The directory for all partials
 */
function get_partials_directory_uri() {
    return get_template_directory() . '/templates/partials';
}

/**
 * Returns the absolute directory for flexible content for the theme
 *
 * @return string The directory for all partials
 */
function get_flexible_content_directory_uri() {
    return get_template_directory() . '/templates/flexible';
}

/**
 * Gets the flexible content template URI.
 *
 * This is used to return a valid URI of the template when looping through the
 * flexible content blocks and returns the correctly named template. It should
 * be used in any template (usually the `page.php` file which is used to display
 * the flexible content blocks.
 *
 * Here is a code example of what the usage of this function would look like in
 * a template file:
 *
 *     while ( have_posts() ) : the_post();
 *         if ( have_rows( 'flexible_content' ) ) :
 *             while ( have_rows( 'flexible_content' ) ) : the_row();
 *                 $layout = get_flexible_content_template_uri( get_row_layout() );
 *                 if ( file_exists( $layout ) ) include $layout;
 *             endwhile;
 *         endif;
 *     endwhile;
 *
 * @param  string $template The name of the template
 * @return string           The absolute path of the template
 */
function get_flexible_content_template_uri( $template ) {
    $template = str_replace( '_', '-', $template );
    return get_flexible_content_directory_uri() . '/' . $template . '.php';
}


/** 1.3 SVG Icon System */

/**
 * Return the HTML for an SVG symbol
 *
 * @param  string        $symbol_name           The name of the symbol
 * @param  string        $role                  The role of the symbol
 * @param  string|array  $class_names Any additional class names needed
 * @return string
 */
function get_svg( $symbol_name, $role = 'img', $class_names = '' ) {
    if ( is_array( $class_names ) ) {
        $class_names = implode( ' ', $class_names );
    }
    if ( strlen( $class_names ) > 0 ) {
        $class_names = ' ' . $class_names;
    }

    if ( null === $role ) {
        $role = 'img';
    }

    $symbol_name = esc_attr( strtolower( $symbol_name ) );
    $role = esc_attr( $role );
    $class_names = esc_attr( $class_names );

    $html = '<span class="o-icon o-icon--' . $symbol_name . $class_names . '">' . PHP_EOL;
    $html .= '    <svg class="o-icon__svg" role="' . $role . '">' . PHP_EOL;
    $html .= '        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-' . $symbol_name . '"/>' . PHP_EOL;
    $html .= '    </svg>' . PHP_EOL;
    $html .= '</span>';
    return $html;
}


/** 1.4 Theme Setup */

function theme_scripts() {
    $css_main = '/css/main.css';
    $js_manifest = '/js/manifest.js';
    $js_main = '/js/global.js';

    // SETUP INSTRUCTION: Uncomment and change to load fonts from fonts.net
    // wp_enqueue_script( 'fonts', '//fast.fonts.net/jsapi/cc1bfd02-cbed-4a48-93d2-d7c420db9cb6.js', [], false, false );
    wp_enqueue_style( 'style', get_build_directory_uri() . $css_main, [],
        get_revision_string( '/build' . $css_main ) );
    wp_enqueue_script( 'manifest', get_build_directory_uri() . $js_manifest, [],
        get_revision_string( '/build' . $js_manifest ), true );
    wp_enqueue_script( 'vendor', get_build_directory_uri() . '/js/vendor.js', [], '', true );
    wp_enqueue_script( 'global', get_build_directory_uri() . $js_main, [],
        get_revision_string( '/build' . $js_main ), true );
}


/** 1.5 Theme Functions */

/**
 * Return the page id based on the page slug
 * @param  string $slug Slug of page ID requested
 * @return int          ID of the requested page
 */
function get_page_id( $slug ) {
    // SETUP INSTRUCTION: Add page IDs here in order to target them in code for permalinks and ACF
    switch ( $slug ) {
        case 'homepage':
            return 1;
    }
}
