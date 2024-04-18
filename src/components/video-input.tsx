'use client';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";
import { useState } from 'react';
import Link from 'next/link';

const formSchema = z.object( {
    reel_link: z.string().min( 12, {
        message: "Reel link must not be less than 12 characters"
    } ),
} );

export function VideoInputForm() {
    const [ data, setData ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ isSubmitted, setIsSubmitted ] = useState( false );
    const form = useForm<z.infer<typeof formSchema>>( {
        resolver: zodResolver( formSchema ),
        defaultValues: {
            reel_link: "",
        }
    } );

    const onSubmit = async ( values: z.infer<typeof formSchema> ) => {
        setIsLoading( true );
        const options = {
            method: 'GET',
            // https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php
            url: "https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php",
            params: {
                url: values.reel_link
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY as string,

                'X-RapidAPI-Host': process.env.RAPID_API_HOST as string
            }
        };


        try {
            const response = await axios.request( options );
            if ( response.status === 200 ) {
                setIsLoading( false );
                setIsSubmitted( true );
            }
            const result = response.data;
            setData( result );
            return result;
        } catch ( error ) {
            console.error( error );
        }
    };


    return (
        <div>
            <Form { ...form }>
                <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8">
                    <FormField
                        control={ form.control }
                        name="reel_link"
                        render={ ( { field } ) => (
                            <FormItem>
                                <FormLabel>Reel Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="input your reel url" { ...field } />
                                </FormControl>
                                <FormDescription>
                                    <Switch />
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        ) }
                    />
                    { isSubmitted ? (
                        data && (
                            <Button>
                                <Link href={ data.links[ 'Download High Quality' ] } download="video_high_quality.mp4" onClick={ () => setIsSubmitted( false ) }>
                                    Download
                                </Link>
                            </Button>
                        )
                    ) : (
                        <Button type="submit" disabled={ isLoading }>
                            { isLoading ? 'Loading...' : 'Submit' }
                        </Button>
                    ) }
                </form>

            </Form>


        </div>

    );
}
