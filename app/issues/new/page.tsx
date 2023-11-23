"use client";

import { Button, Callout, Text, TextField } from '@radix-ui/themes';
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from 'react-hook-form';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { validationSchema } from '@/app/validationSchema';
import { z } from 'zod';
import ErrorMessage from '@/app/components/errorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof validationSchema>;

const newIssuePage = () => {
    const router = useRouter();
    const {register, control, handleSubmit, formState: { errors }} = useForm<IssueForm>({
        resolver: zodResolver(validationSchema)
    });
    const [isSubbmiting, changeIsSubmitting] = useState(false);
    

    return (
    <div className='max-w-xl space-y-3'>
        <form
            className=' space-y-3'
            onSubmit={handleSubmit( async (data) => {
                try{
                    changeIsSubmitting(true);
                    let res = await fetch("/api/issues", {method: "post", body: JSON.stringify(data)});
                    if(!res.ok){
                        await res.text().then(text => { throw new Error(text) });
                    }
                    router.push("/issues");
                }
                catch(error){
                    console.log("An unexpected error occurred");
                    changeIsSubmitting(false);
                }
            })}
        >
            <TextField.Root>
                <TextField.Input placeholder='Title' {...register("title")}/>
            </TextField.Root>
            <ErrorMessage>{errors.title?.message}</ErrorMessage>
            <Controller
                name="description"
                control={control}
                render={({field}) => <SimpleMDE placeholder='Description' {...field}/>}
            />
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
            <Button disabled={isSubbmiting}>Submit New Issue {isSubbmiting && <Spinner/>}</Button>
        </form>
    </div>
    )
}

export default newIssuePage