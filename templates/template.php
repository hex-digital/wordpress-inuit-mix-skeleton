<?php
/**
 * The template for displaying all pages.
 *
 * @package Hex Digital
 * @subpackage Skeleton Theme
 * @since 2016
 *
 * Template Name: Template
 */

get_header() ?>

    <? while ( have_posts() ): the_post() ?>

        <? the_title() ?>

        <? the_content() ?>

    <? endwhile ?>

<? get_footer() ?>
